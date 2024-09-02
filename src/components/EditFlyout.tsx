import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useFetchUser from "../hooks/useFetchUser";
import useTost from "../hooks/useTost";
import { FieldErrorType, MeetingType, UserType } from "../utils/Type";
import moment from "moment";
import { firebaseDB } from "../utils/FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiSwitch,
  EuiTitle,
} from "@elastic/eui";
import MeetingNameField from "./FormComponent/MeetingNameField";
import MeetingMaximumUserField from "./FormComponent/MeetingMaximumUserField";
import MeetingUsersField from "./FormComponent/MeetingUsersField";
import MeetingDateField from "./FormComponent/MeetingDateField";
import CreateMeetingButton from "./FormComponent/CreateMeetingButton";

export default function EditFlyout({
  closeEditFlyout,
  meetings,
}: {
  closeEditFlyout: any;
  meetings: MeetingType;
}) {
  useAuth();
  const users = useFetchUser();

  const [createTost] = useTost();
  const [meetingName, setMeetingName] = useState(meetings.meetingName);
  const [selectedUsers, setSelectedUsers] = useState<Array<UserType>>([]);
  const [startDate, setStartDate] = useState(moment(meetings.meetingDate));
  const [groupSize, setGroupSize] = useState(1);
  const [meetingType] = useState(meetings.meetingType);
  const [status, setStatus] = useState(false);
  const [showErrors] = useState<{
    meetingName: FieldErrorType;
    meetingUser: FieldErrorType;
  }>({
    meetingName: {
      show: false,
      message: [],
    },
    meetingUser: {
      show: false,
      message: [],
    },
  });

  useEffect(() => {
    if (users) {
      const foundUser: Array<UserType> = [];
      meetings.invitedUsers.forEach((user: string) => {
        const FindUser = users.find(
          (tempUser: UserType) => tempUser.uid === user
        );
        if (FindUser) {
          foundUser.push(FindUser);
        }
      });
      setSelectedUsers(foundUser);
    }
  }, [meetings, users]);

  const onUserChange = (selectedOption: any) => {
    setSelectedUsers(selectedOption);
  };

  const editMeeting = async () => {
    const editedMeeting = {
      ...meetings,
      meetingName,
      meetingType,
      invitedUsers: selectedUsers.map((user: UserType) => user.uid),
      maxUser: groupSize,
      meetingDate: startDate.format("L"),
      status: !status,
    };
    
    delete editedMeeting.docId;
    const docRef = doc(firebaseDB, "meeting", meetings.docId!);
    await updateDoc(docRef, editedMeeting);
    createTost({
      title: "Meeting Edited successfully",
      type: "success",
    });

    closeEditFlyout();

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };
  return (
    <EuiFlyout ownFocus onClose={() => closeEditFlyout()}>
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2>{meetings.meetingName}</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiForm>
          <MeetingNameField
            label="Meeting Name"
            placeholder="Meeting Name"
            value={meetingName}
            setMeetingName={setMeetingName}
            isInvalid={showErrors.meetingName.show}
            error={showErrors.meetingName.message}
          />
          {meetingType === "anyone-can-join" ? (
            <MeetingMaximumUserField
              value={groupSize}
              setValue={setGroupSize}
            />
          ) : (
            <MeetingUsersField
              label="Invite User"
              isInvalid={showErrors.meetingUser.show}
              error={showErrors.meetingUser.message}
              options={users}
              onChange={onUserChange}
              selectedOptions={selectedUsers}
              singleSelection={
                meetingType === "1-on-1" ? { asPlainText: true } : false
              }
              isCrearable={false}
              placeholder="Select a user"
            />
          )}
          <MeetingDateField selected={startDate} setStartDate={setStartDate} />
          <EuiFormRow display="columnCompressedSwitch" label="Cancel Meeting">
            <EuiSwitch
              showLabel={false}
              label="Cancel Meeting"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
            />
          </EuiFormRow>
          <EuiSpacer />
          <CreateMeetingButton
            createMeeting={editMeeting}
            isEdit={true}
            closeEditFlyout={closeEditFlyout}
          />
        </EuiForm>
      </EuiFlyoutBody>
    </EuiFlyout>
  );
}
