export default function FormErrorComponent({
  errors,
}: {
  errors: Record<string, unknown>;
}) {
  const result = Object.entries(errors).map(([key, value]) => ({
    input: key,
    message:
      typeof value === 'object' && value && 'message' in value
        ? (value as { message?: string }).message || ''
        : '',
  }));

  return (
    <div className='-mt-2'>
      {result?.length === 0 ? (
        <div className='py-2'>&nbsp;</div>
      ) : (
        <div className='py-2 px-4 rounded-md border border-red-500  text-red-500'>
          {result[0].message}
        </div>
      )}
    </div>
  );
}
