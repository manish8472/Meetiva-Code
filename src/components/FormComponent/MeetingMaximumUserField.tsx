import { EuiFieldNumber, EuiFormRow } from "@elastic/eui";

export default function MeetingMaximumUserField({
  value,
  setValue,
}: {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <EuiFormRow label="Maximum People">
      <EuiFieldNumber
        placeholder="Maximum People"
        max ={50}
        min={1}
        value={value}
        onChange={(e) => {
          if(parseInt(e.target.value) <= 0) setValue(1);
          else if(parseInt(e.target.value) > 50) setValue(50); 
          else setValue(parseInt(e.target.value));
        }}
      />
    </EuiFormRow>
  );
}
