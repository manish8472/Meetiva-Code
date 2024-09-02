import { useState, useEffect } from "react";
import { MeetingType } from "../utils/Type";
import { useAppSelector } from "../app/hooks";
import { getDocs, query } from "firebase/firestore";
import { meetingRef } from "../utils/FirebaseConfig";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import moment from "moment";

import {
  EuiBadge,
  EuiBasicTable,
  EuiButtonIcon,
  EuiCopy,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
} from "@elastic/eui";
import { Link } from "react-router-dom";


export default function Meeting() {
  useAuth();
  const [meetings, setMeetings] = useState<Array<MeetingType>>([]);
  const userInfo = useAppSelector((user) => user.auth.userInfo);

  // get my meetings from database
  const getMyMeetings = async () => {
    const firestoreQuery = query(
      meetingRef
    );
    const fetchedMeetings = await getDocs(firestoreQuery);

    if (fetchedMeetings.docs.length) {
      const MyMeetings: Array<MeetingType> = [];

      fetchedMeetings.forEach((meeting) => {
        const data = meeting.data() as MeetingType;
        if(data.createdBy == userInfo?.uid) MyMeetings.push(data);
        else if(data.meetingType == "1-on-1") MyMeetings.push(data);
        else {
            const index = data.invitedUsers.findIndex(user => user === userInfo?.uid);
            if(index != -1) MyMeetings.push(data);
        }
      });
      setMeetings(MyMeetings);
    }
  };

  useEffect(() => {
    if (userInfo) {
      getMyMeetings();
    }
  }, [userInfo]);

  // This is used for table. Name value is uesd for column name
  // And field value is same as meeting propperty
  // If Field value is empty then render function is used, For what is showing that position

  const columns = [
    {
      field: "meetingName",
      name: "Meeting Name",
    },
    {
      field: "meetingType",
      name: "Meeting Type",
    },
    {
      field: "meetingDate",
      name: "Meeting Date",
    },
    {
      field: "",
      name: "Status",
      render: (meeting: MeetingType) => {
        if (meeting.status) {
          if (meeting.meetingDate === moment().format("L")) {
            return (
              <EuiBadge color="warning">
                <Link
                  style={{ color: "black" }}
                  to={`/joinmeeting/${meeting.meetingId}`}
                >
                  Join Now
                </Link>
              </EuiBadge>
            );
          } else if (meeting.meetingDate > moment().format("L")) {
            return <EuiBadge color="primary">Upcoming</EuiBadge>;
          } else if (meeting.meetingDate < moment().format("L")) {
            return <EuiBadge color="default">Ended</EuiBadge>;
          }
        } else return <EuiBadge color="danger">Cancelled</EuiBadge>;
      },
    },
    
    {
      field: "meetingId",
      name: "Copy Link",
      render: (meetingId: string) => {
        return (
          <EuiCopy textToCopy={`localhost:5173/joinmeeting/${meetingId}`}>
            {(copy: any) => (
              <EuiButtonIcon
                iconType="copy"
                onClick={copy}
                display="base"
                aria-label="Meeting-copy"
                content="Copy"
                title="Copy"
              />
            )}
          </EuiCopy>
        );
      },
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Header />
      <EuiFlexGroup
        justifyContent="center"
        style={{
          margin: "1rem",
        }}
      >
        <EuiFlexItem>
          <EuiPanel>
            <EuiBasicTable columns={columns} items={meetings} />
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

    </div>
  );
}
