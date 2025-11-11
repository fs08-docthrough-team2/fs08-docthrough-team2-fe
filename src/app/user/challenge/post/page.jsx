'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateChallengeMutation } from '@/hooks/mutations/useChallengeMutations';
import { formatUTCDate } from '@/libs/day';
import { showToast } from '@/components/common/Sonner';
import Spinner from '@/components/common/Spinner';
import BaseInput from '@/components/atoms/Input/BaseInput';
import DateInput from '@/components/atoms/Input/DateInput';
import TextBox from '@/components/atoms/Input/TextBox';
import DropdownCategory from '@/components/molecules/Dropdown/DropdownCategory';
import DropdownDocument from '@/components/molecules/Dropdown/DropdownDocument';
import Button from '@/components/atoms/Button/Button';
import styles from '@/styles/pages/challenge/post/ChallengePostPage.module.scss';

const FIELD_LABEL_TO_CODE = {
  'Next.js': 'NEXT',
  API: 'API',
  Career: 'CAREER',
  'Modern JS': 'MODERN',
  Web: 'WEB',
};

const DOCUMENT_LABEL_TO_CODE = {
  공식문서: 'OFFICIAL',
  블로그: 'BLOG',
};

const COOLDOWN_DURATION_MS = 3000;

export default function ChallengePostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    source: 'https://',
    deadline: '',
    capacity: '',
    content: '',
  });
  const [fieldLabel, setFieldLabel] = useState(null);
  const [typeLabel, setTypeLabel] = useState(null);

  const requestBody = useMemo(
    () => ({
      title: form.title.trim(),
      source: form.source.trim(),
      field: FIELD_LABEL_TO_CODE[fieldLabel] ?? '',
      type: DOCUMENT_LABEL_TO_CODE[typeLabel] ?? '',
      deadline: formatUTCDate(form.deadline),
      capacity: form.capacity !== '' ? form.capacity : '',
      content: form.content.trim(),
    }),
    [form, fieldLabel, typeLabel],
  );

  const createChallengeMutation = useCreateChallengeMutation();
  const isSubmitting = createChallengeMutation.isPending;

  const [isPageLoading, setIsPageLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);

  const [isCooldown, setIsCooldown] = useState(false);
  const cooldownTimerRef = useRef(null);

  useEffect(
    () => () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    },
    [],
  );

  const startCooldown = () => {
    if (cooldownTimerRef.current) {
      clearTimeout(cooldownTimerRef.current);
    }
    setIsCooldown(true);
    cooldownTimerRef.current = setTimeout(() => {
      setIsCooldown(false);
      cooldownTimerRef.current = null;
    }, COOLDOWN_DURATION_MS);
  };

  const resetCooldown = () => {
    if (cooldownTimerRef.current) {
      clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
    setIsCooldown(false);
  };

  const isBusy = isPageLoading || isSubmitting || isCooldown;

  const isFormValid = useMemo(
    () =>
      Boolean(
        requestBody.title &&
          requestBody.source &&
          requestBody.field &&
          requestBody.type &&
          requestBody.deadline &&
          requestBody.capacity &&
          requestBody.content,
      ),
    [requestBody],
  );

  const isSubmitDisabled = isBusy || !isFormValid;

  const handleChange = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleCapacityChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, '');
    const normalized = digitsOnly === '' ? '' : String(Number(digitsOnly));
    setForm((prev) => ({ ...prev, capacity: normalized }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isBusy) return;

    if (new Date(requestBody.deadline) <= new Date()) {
      showToast({
        kind: 'error',
        title: '마감일은 오늘 이후의 날짜로 설정해주세요.',
      });
      return;
    }

    const capacityValue = Number(form.capacity);
    if (!Number.isFinite(capacityValue) || capacityValue < 2) {
      showToast({
        kind: 'error',
        title: '최대 참여 인원은 최소 2명입니다.',
      });
      return;
    }

    if (form.content.trim().length < 10) {
      showToast({
        kind: 'error',
        title: '내용은 최소 10자 이상이어야 합니다.',
      });
      return;
    }

    startCooldown();

    createChallengeMutation.mutate(requestBody, {
      onSuccess: (data) => {
        const challengeId = data?.data?.createChallenge?.challenge_id;
        showToast({
          kind: 'success',
          title: '챌린지 등록에 성공했어요',
        });
        router.replace(`/user/my-challenge/${challengeId}/status`);
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? '챌린지 등록에 실패했어요';
        showToast({
          kind: 'error',
          title: message,
        });
      },
      onSettled: () => {
        resetCooldown();
      },
    });
  };

  return (
    <>
      <Spinner isLoading={isBusy} />
      <section className={styles.wrapper} aria-busy={isBusy}>
        <h1 className={styles.title}>신규 챌린지 신청</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <BaseInput
            name="title"
            label="제목"
            placeholder="제목을 입력해주세요"
            value={form.title}
            onChange={handleChange('title')}
            disabled={isBusy}
          />

          <BaseInput
            name="source"
            type="url"
            label="원문 링크"
            placeholder="원문 링크를 입력해주세요"
            value={form.source}
            onChange={handleChange('source')}
            disabled={isBusy}
          />

          <div className={styles.rowDropdown}>
            <span className={styles.label}>분야</span>
            <div className={styles.dropdown}>
              <DropdownCategory onSelect={setFieldLabel} disabled={isBusy} />
            </div>
          </div>

          <div className={styles.rowDropdown}>
            <span className={styles.label}>문서 종류</span>
            <div className={styles.dropdown}>
              <DropdownDocument onSelect={setTypeLabel} disabled={isBusy} />
            </div>
          </div>

          <DateInput
            label="마감일"
            value={form.deadline}
            onChange={handleChange('deadline')}
            disabled={isBusy}
          />

          <BaseInput
            name="capacity"
            type="number"
            label="최대 참여 인원"
            placeholder="인원을 입력해주세요"
            value={form.capacity}
            onChange={handleCapacityChange}
            inputProps={{ min: 1 }}
            disabled={isBusy}
          />

          <div>
            <span className={styles.label}>내용</span>
            <TextBox
              className={styles.textBox}
              id="challenge-content"
              name="content"
              placeholder="내용을 입력해주세요"
              value={form.content}
              onChange={handleChange('content')}
              disabled={isBusy}
            />
          </div>

          <div>
            <Button variant="solid" size="lg" disabled={isSubmitDisabled}>
              {isBusy ? '처리 중…' : '신청하기'}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}
