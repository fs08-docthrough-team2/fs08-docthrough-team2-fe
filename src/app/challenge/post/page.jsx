'use client';

import { useMemo, useState } from 'react';
import BaseInput from '@/components/atoms/Input/BaseInput';
import DateInput from '@/components/atoms/Input/DateInput';
import TextBox from '@/components/atoms/Input/TextBox';
import DropdownCategory from '@/components/molecules/Dropdown/DropdownCategory';
import DropdownDocument from '@/components/molecules/Dropdown/DropdownDocument';
import Button from '@/components/atoms/Button/Button';
import styles from '@/styles/pages/challenge/post/ChallengePostPage.module.scss';

const FIELD_LABEL_TO_CODE = {
  'Next.js': 'NEXT_JS',
  API: 'API',
  Career: 'CAREER',
  'Modern JS': 'MODERN_JS',
  Web: 'WEB',
};

const DOCUMENT_LABEL_TO_CODE = {
  공식문서: 'OFFICIAL',
  블로그: 'BLOG',
};

const formatDeadline = (raw) => {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 6) return '';
  const yy = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const dd = digits.slice(4, 6);
  const year = String(2000 + Number(yy)).padStart(4, '0');
  return `${year}-${mm}-${dd}T23:59:59+09:00`;
};

export default function ChallengePostPage() {
  const [form, setForm] = useState({
    title: '',
    source: '',
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
      deadline: formatDeadline(form.deadline),
      capacity: form.capacity !== '' ? String(Number(form.capacity)) : '',
      content: form.content.trim(),
    }),
    [form, fieldLabel, typeLabel],
  );

  const handleChange = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleCapacityChange = (event) => {
    const digits = event.target.value.replace(/\D/g, '');
    setForm((prev) => ({ ...prev, capacity: digits }));
  };

  // 나중에 api로 넘기도록 수정 예정, 일단 console log로 확인
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('requestBody', requestBody);
  };

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>신규 챌린지 신청</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <BaseInput
          name="title"
          label="제목"
          placeholder="제목을 입력해주세요"
          value={form.title}
          onChange={handleChange('title')}
        />

        <BaseInput
          name="source"
          type="url"
          label="원문 링크"
          placeholder="원문 링크를 입력해주세요"
          value={form.source}
          onChange={handleChange('source')}
        />

        <div className={styles.rowDropdown}>
          <span className={styles.label}>분야</span>
          <div className={styles.dropdown}>
            <DropdownCategory onSelect={setFieldLabel} />
          </div>
        </div>

        <div className={styles.rowDropdown}>
          <span className={styles.label}>문서 타입</span>
          <div className={styles.dropdown}>
            <DropdownDocument onSelect={setTypeLabel} />
          </div>
        </div>

        <DateInput label="마감일" value={form.deadline} onChange={handleChange('deadline')} />

        <BaseInput
          name="capacity"
          type="number"
          label="최대 인원"
          placeholder="인원을 입력해주세요"
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
            placeholder="내용을 입력해주세요"
            value={form.content}
            onChange={handleChange('content')}
          />
        </div>
        <div>
          <Button variant="solid" size="lg">
            신청하기
          </Button>
        </div>
      </form>
    </section>
  );
}
