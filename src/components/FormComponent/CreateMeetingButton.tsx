import { EuiButton, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { useNavigate } from "react-router-dom";

// Create Cancel and Submit Button

export default function CreateMeetingButton({
  createMeeting,
  isEdit,
  closeEditFlyout,
}: {
  createMeeting: () => void;
  isEdit?: boolean;
  closeEditFlyout?: () => {};
}) {
  const navigate = useNavigate();
  return (
    <EuiFlexGroup>
      <EuiFlexItem grow={false}>
        <EuiButton
          color="danger"
          fill
          onClick={() => {isEdit ? closeEditFlyout!() : navigate("/")}}
          >
            Cancel
        </EuiButton>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton fill onClick={createMeeting}>
          {isEdit ? "Edit Meeting" : "Create Meeting"}
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
