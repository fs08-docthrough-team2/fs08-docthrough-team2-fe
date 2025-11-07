'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUpdateChallengeMutation } from '@/hooks/mutations/useChallengeMutations';
import { useChallengeDetailQuery } from '@/hooks/queries/useChallengeQueries.js';
import { formatUTCDate, formatYYMMDD } from '@/libs/day';
import { useIsAdmin } from '@/hooks/useAuthStatus';
import { showToast } from '@/components/common/Sonner';
import Button from '@/components/atoms/Button/Button';
import BaseInput from '@/components/atoms/Input/BaseInput';
import DateInput from '@/components/atoms/Input/DateInput';
import TextBox from '@/components/atoms/Input/TextBox';
import DropdownCategory from '@/components/molecules/Dropdown/DropdownCategory';
import DropdownDocument from '@/components/molecules/Dropdown/DropdownDocument';
import styles from '@/styles/pages/challenge/edit/ChallengeEditPage.module.scss';

const FIELD_LABEL_TO_CODE = {
  'Next.js': 'NEXT',
  API: 'API',
  Career: 'CAREER',
  'Modern JS': 'MODERN',
  Web: 'WEB',
};

const FIELD_CODE_TO_LABEL = Object.fromEntries(
  Object.entries(FIELD_LABEL_TO_CODE).map(([label, code]) => [code, label]),
);

const DOCUMENT_LABEL_TO_CODE = {
  공식문서: 'OFFICIAL',
  블로그: 'BLOG',
};

const DOCUMENT_CODE_TO_LABEL = Object.fromEntries(
  Object.entries(DOCUMENT_LABEL_TO_CODE).map(([label, code]) => [code, label]),
);

export default function ChallengeEditPage() {
  const router = useRouter();
  const { challengeId } = useParams();
  const [form, setForm] = useState({
    title: '',
    source: '',
    deadline: '',
    capacity: '',
    content: '',
  });
  const [fieldLabel, setFieldLabel] = useState(null);
  const [typeLabel, setTypeLabel] = useState(null);
  const { data: challengeData, isLoading, error } = useChallengeDetailQuery(challengeId);
  const challengeDetail = challengeData?.data;
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (!challengeDetail) return;
    const normalizedCapacity = challengeDetail.capacity ?? challengeDetail.maxParticipants ?? '';

    setForm({
      title: challengeDetail.title ?? '',
      source: challengeDetail.source ?? '',
      deadline: challengeDetail.deadline ? formatYYMMDD(challengeDetail.deadline) : '',
      capacity: normalizedCapacity !== '' ? String(normalizedCapacity) : '',
      content: challengeDetail.content ?? '',
    });

    setFieldLabel(FIELD_CODE_TO_LABEL[challengeDetail.field] ?? null);
    setTypeLabel(DOCUMENT_CODE_TO_LABEL[challengeDetail.type] ?? null);
  }, [challengeDetail]);

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

  const updateChallengeMutation = useUpdateChallengeMutation({
    onSuccess: () => {
      showToast({
        kind: 'success',
        title: '챌린지를 수정했어요.',
      });
      router.push(isAdmin ? `/admin/${challengeId}/status` : `/challenge/detail/${challengeId}`);
    },
    onError: (error) => {
      const message = error.response?.data?.message;
      showToast({
        kind: 'error',
        title: '수정 실패',
      });
    },
  });

  const handleChange = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleCapacityChange = (event) => {
    const digits = event.target.value.replace(/\D/g, '');
    setForm((prev) => ({ ...prev, capacity: digits }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid =
      requestBody.title &&
      requestBody.source &&
      requestBody.field &&
      requestBody.type &&
      requestBody.deadline &&
      requestBody.capacity &&
      requestBody.content;

    console.log('requestBody', requestBody);

    if (!isValid) {
      showToast({
        kind: 'warning',
        title: '입력값을 확인해 주세요.',
      });
      return;
    }
    console.log('Submitting update with body:', requestBody);

    updateChallengeMutation.mutate({ challengeId, payload: requestBody });
  };

  if (isLoading) {
    return (
      <section className={styles.loadingWrapper}>
        <p className={styles.loadingText}>챌린지 정보를 불러오는 중입니다</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.stateWrapper}>
        <p className={styles.stateMessage}>챌린지 정보를 불러오지 못했습니다.</p>
        <div className={styles.stateActions}>
          <Button variant="solid" onClick={() => router.back()}>
            돌아가기
          </Button>
          <Button variant="solid" onClick={() => router.refresh()}>
            다시 시도
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>챌린지 수정</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <BaseInput
          name="title"
          label="제목"
          placeholder="제목을 입력해 주세요"
          value={form.title}
          onChange={handleChange('title')}
        />

        <BaseInput
          name="source"
          type="url"
          label="출처 링크"
          placeholder="출처 URL을 입력해 주세요"
          value={form.source}
          onChange={handleChange('source')}
        />

        <div className={styles.rowDropdown}>
          <span className={styles.label}>분야</span>
          <div className={styles.dropdown}>
            <DropdownCategory onSelect={setFieldLabel} defaultLabel={fieldLabel ?? '카테고리'} />
          </div>
        </div>

        <div className={styles.rowDropdown}>
          <span className={styles.label}>문서 타입</span>
          <div className={styles.dropdown}>
            <DropdownDocument onSelect={setTypeLabel} defaultLabel={typeLabel ?? '문서 타입'} />
          </div>
        </div>

        <DateInput label="마감일" value={form.deadline} onChange={handleChange('deadline')} />

        <BaseInput
          name="capacity"
          type="number"
          label="최대 인원"
          placeholder="인원을 입력해 주세요"
          value={form.capacity}
          onChange={handleCapacityChange}
          inputProps={{ min: 1 }}
        />

        <div>
          <span className={styles.label}>내용</span>
          <TextBox
            className={styles.textBox}
            id="challenge-content"
            name="content"
            placeholder="내용을 입력해 주세요"
            value={form.content}
            onChange={handleChange('content')}
          />
        </div>

        <div>
          <Button
            variant="solid"
            size="lg"
            disabled={updateChallengeMutation.isPending || isLoading}
          >
            {updateChallengeMutation.isPending ? '수정 중…' : '수정하기'}
          </Button>
        </div>
      </form>
    </section>
  );
}
