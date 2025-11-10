'use client';
import { useState, forwardRef, useMemo } from 'react';
import dayjs from 'dayjs';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import BaseInput from '@/components/atoms/Input/BaseInput';
import baseStyles from '@/styles/components/atoms/Input/BaseInput.module.scss';

// 안 보이는 더미 input
const HiddenInput = forwardRef(function HiddenInput(props, ref) {
  return (
    <input
      ref={ref}
      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      readOnly
      {...props}
    />
  );
});

// 숫자만 받아 YY/MM/DD로 포맷
function formatYYMMDD(raw) {
  const digits = (raw || '').replace(/\D/g, '').slice(0, 6); // YY MM DD -> 6자리
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export default function DateInput({
  label = '마감 기한',
  value, // "YY/MM/DD"
  onChange, // e => e.target.value 로 문자열 전달
  min, // "YY/MM/DD" (옵션)
  max, // "YY/MM/DD" (옵션)
  placeholder = 'YY/MM/DD',
}) {
  const [open, setOpen] = useState(false);

  // 유효한 문자열일 때만 Date로 변환 (엄격 모드)
  const selected = useMemo(() => {
    const v = String(value || '');
    const d = dayjs(v, 'YY/MM/DD', true);
    return d.isValid() ? d.toDate() : null;
  }, [value]);

  const minDate = useMemo(() => (min ? dayjs(min, 'YY/MM/DD', true).toDate() : undefined), [min]);
  const maxDate = useMemo(() => (max ? dayjs(max, 'YY/MM/DD', true).toDate() : undefined), [max]);

  const apply = (date) => {
    if (!date) return;
    const formatted = dayjs(date).format('YY/MM/DD');
    onChange?.({ target: { value: formatted } });
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const next = formatYYMMDD(e.target.value);
    onChange?.({ target: { value: next } });
  };

  return (
    <div style={{ position: 'relative' }}>
      <BaseInput
        label={label}
        placeholder={placeholder}
        value={value ?? ''}
        type="text"
        // 입력도 되고, 클릭하면 달력도 열리게
        inputProps={{
          onChange: handleInputChange,
          onClick: () => setOpen(true),
          inputMode: 'numeric', // 모바일 숫자 키패드
          autoComplete: 'off',
          spellCheck: false,
        }}
        rightNode={
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={baseStyles.iconBtn}
          >
            <img src="/icons/calendar.svg" alt="" width={32} height={32} />
          </button>
        }
      />

      {/* 달력 팝업 */}
      <ReactDatePicker
        selected={selected}
        onChange={apply}
        open={open}
        onClickOutside={() => setOpen(false)}
        showPopperArrow={false}
        popperPlacement="bottom-end"
        dateFormat="yy/MM/dd"
        minDate={minDate}
        maxDate={maxDate}
        customInput={<HiddenInput />}
      />
    </div>
  );
}
