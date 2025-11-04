import { Toaster, toast } from 'sonner';

const METHOD_MAP = {
  success: toast.success,
  error: toast.error,
  warning: toast.warning,
  info: toast.info,
  loading: toast.loading,
};

export function AppToaster({
  position = 'top-center',
  expand = false,
  richColors = true,
  ...rest
}) {
  return <Toaster position={position} expand={expand} richColors={richColors} {...rest} />;
}

export function showToast({ kind = 'info', title } = {}) {
  const handler = METHOD_MAP[kind] || toast;
  return handler(title);
}
