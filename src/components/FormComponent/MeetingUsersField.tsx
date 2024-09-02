import { EuiComboBox, EuiFormRow } from '@elastic/eui'

function MeetingUsersField({
  label,
  options,
  onChange,
  selectedOptions,
  isCrearable,
  placeholder,
  singleSelection = false,
  isInvalid,
  error,
}: {
  label: string;
  options: any;
  onChange: any;
  selectedOptions: any;
  isCrearable: boolean;
  placeholder: string;
  singleSelection: any;
  isInvalid: boolean;
  error: Array<string>;
}) {
  return (
    <EuiFormRow label={label} isInvalid={isInvalid} error={error}>
      <EuiComboBox
        options={options}
        onChange={onChange}
        selectedOptions={selectedOptions}
        singleSelection={singleSelection}
        placeholder={placeholder}
        isClearable={isCrearable}
        isInvalid={isInvalid}
      />
    </EuiFormRow>
  );
}

export default MeetingUsersField
