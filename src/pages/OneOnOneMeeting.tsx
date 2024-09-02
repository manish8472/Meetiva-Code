import { useState } from "react";
import Header from "../components/Header";
import { EuiFlexGroup, EuiForm, EuiFormRow, EuiSpacer } from "@elastic/eui";
import MeetingNameField from "../components/FormComponent/MeetingNameField";
import MeetingUsersField from "../components/FormComponent/MeetingUsersField";
import useAuth from "../hooks/useAuth";
import useFetchUser from "../hooks/useFetchUser";
import moment from "moment";
import MeetingDateField from "../components/FormComponent/MeetingDateField";
import CreateMeetingButton from "../components/FormComponent/CreateMeetingButton";
import { FieldErrorType, UserType } from "../utils/Type";
import { addDoc } from "firebase/firestore";
import { meetingRef } from "../utils/FirebaseConfig";
import { generateMeetingID } from "../utils/GenerateMeeting";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import useTost from "../hooks/useTost";

function OneOnOneMeeting() {
const navigate = useNavigate();
useAuth();
const users = useFetchUser();
const uid = useAppSelector((zoom) => zoom.auth.userInfo?.uid);

  const [createTost] = useTost();
  const [meetingName, setMeetingName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Array<UserType>>([]);
  const [startDate, setStartDate] = useState(moment());
  const [showErrors, setShowErrors] = useState<{
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
    }
  });


  const onUserChange = (selectedOption: any) => {
    setSelectedUsers(selectedOption);
  };

  const validateForm = () => {
    let errors = false;
    const cloneShowError = {...showErrors};
    if (!meetingName.length) {
      cloneShowError.meetingName.show = true;
      cloneShowError.meetingName.message = ["Please Enter Meeting Name"];
      errors = true;
    } else {
      cloneShowError.meetingName.show = false;
      cloneShowError.meetingName.message = [];
    }
    if (!selectedUsers.length) {
      cloneShowError.meetingUser.show = true;
      cloneShowError.meetingUser.message = ["Please select a Person"];
      errors = true;
    } else {
      cloneShowError.meetingUser.show = false;
      cloneShowError.meetingUser.message = [];
    }
    setShowErrors(cloneShowError);
    return errors;
  };

  const createMeeting = async() => {
    
    // 
    if(!validateForm()){
      const meetingId = generateMeetingID();
      await addDoc(meetingRef, {
        createdBy: uid ,
        meetingId,
        meetingName,
        meetingType:"1-on-1",
        invitedUsers:[selectedUsers[0].uid],
        meetingDate:startDate.format("L"),
        maxUser:1,
        status:true,
      })
      createTost({
        title:"One on One Meeting Created Successfully.",
        type: "success",
      });
      navigate("/");
    }
  };
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Header />
      <EuiFlexGroup justifyContent="center" alignItems="center">
        <EuiForm>
          <MeetingNameField
            label="Meeting Name"
            placeholder="Meeting Name"
            value={meetingName}
            setMeetingName={setMeetingName}
            isInvalid={showErrors.meetingName.show}
            error={showErrors.meetingName.message}
          />

          <MeetingUsersField
            label="Invite User"
            options={users}
            onChange={onUserChange}
            selectedOptions={selectedUsers}
            singleSelection={{ asPlainText: true }}
            isCrearable={false}
            placeholder="Select a user"
            isInvalid={showErrors.meetingUser.show}
            error={showErrors.meetingUser.message}
          />

          <EuiFormRow label="Select a date">
            <MeetingDateField
              selected={startDate}
              setStartDate={setStartDate}
            />
          </EuiFormRow>
          <EuiSpacer />

          <CreateMeetingButton createMeeting={createMeeting} />
        </EuiForm>
      </EuiFlexGroup>
    </div>
  );
}

export default OneOnOneMeeting;
