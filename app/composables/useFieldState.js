export const useFieldState = (props) => {
  const fieldInvalid = inject("fieldInvalid", ref(false));
  const describedBy = inject("fieldDescribedBy", ref(undefined));
  return {
    invalid: computed(() => Boolean(props.invalid) || fieldInvalid.value),
    describedBy,
  };
};
