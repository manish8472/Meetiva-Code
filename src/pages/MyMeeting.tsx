import { useState, useEffect } from "react";
import { MeetingType } from "../utils/Type";
import { useAppSelector } from "../app/hooks";
import { getDocs, query, where } from "firebase/firestore";
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
import EditFlyout from "../components/EditFlyout";

export default function MyMeeting() {
  useAuth();
  const [meetings, setMeetings] = useState<Array<MeetingType>>([]);
  const userInfo = useAppSelector((user) => user.auth.userInfo);

  // get my meetings from database
  const getMyMeetings = async () => {
    const firestoreQuery = query(
      meetingRef,
      where("createdBy", "==", userInfo?.uid)
    );
    const fetchedMeetings = await getDocs(firestoreQuery);

    if (fetchedMeetings.docs.length) {
      const MyMeetings: Array<MeetingType> = [];

      fetchedMeetings.forEach((meeting) => {
        MyMeetings.push({
          docId: meeting.id,
          ...(meeting.data() as MeetingType),
        });
      });
      setMeetings(MyMeetings);
    }
  };

  useEffect(() => {
    if (userInfo) {
      getMyMeetings();
    }
  }, [userInfo]);

  const [showEditFlyout, setShowEditFlyout] = useState(false);
  const [editMeeting, setEditMeeting] = useState<MeetingType>();

  const openEditFlyout = (meeting: MeetingType) => {
    setShowEditFlyout(true);
    setEditMeeting(meeting);
  };

  const closeEditFlyout = () => {
    setShowEditFlyout(false);
    setEditMeeting(undefined);
  };

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
      field: "",
      name: "Edit",

      render: (meeting: MeetingType) => {
        return (
          <EuiButtonIcon
            aria-label="Meeting-edit"
            iconType="indexEdit"
            color="success"
            title="Edit"
            isDisabled={
              !meeting.status || meeting.meetingDate < moment().format("L")
            }
            onClick={() => openEditFlyout(meeting)}
          />
        );
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

      {showEditFlyout && (
        <EditFlyout closeEditFlyout={closeEditFlyout} meetings={editMeeting!} />
      )}
    </div>
  );
}
