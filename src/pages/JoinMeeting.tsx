import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { firebaseAuth, meetingRef } from "../utils/FirebaseConfig";
import { useNavigate, useParams } from "react-router-dom";
import useTost from "../hooks/useTost";
import { getDocs, query, where } from "firebase/firestore";
import moment from "moment";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { generateMeetingID } from "../utils/GenerateMeeting";
import { EuiHeader } from "@elastic/eui";
import { getJoinMeetingBreadCrumbs } from "../utils/BreadCrumbs";

export default function JoinMeeting() {
//  const [breadCrumbs, setBreadCrumbs] = useState([{ text: "Dashboard" }]); 
 
  const params = useParams();
  const navigate = useNavigate();
   const breadCrumbs = getJoinMeetingBreadCrumbs();
  const [createTost] = useTost();
  const [isAllowed, setIsAllowed] = useState(false);
  const [user, setUser] = useState<any>(undefined);
  const [userLoaded, setUserLoaded] = useState(false);


  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    }
    setUserLoaded(true);
  });

  useEffect(() => {
    const getMeetingData = async () => {
        
        if(params.meetingId && userLoaded) {
            const firestoreQuery = query(
              meetingRef,
              where("meetingId", "==", params.meetingId)
            );

            const fetchedMeetings = await getDocs(firestoreQuery);

            if (fetchedMeetings.docs.length) {
              const meeting = fetchedMeetings.docs[0].data();
             
              const isCreater = meeting.createdBy === user?.uid;
              

              if (meeting.meetingType === "1-on-1") {
                if (meeting.invitedUsers[0] === user?.uid || isCreater) {
                  if (meeting.meetingDate === moment().format("L")) {
                    setIsAllowed(true);
                    
                  } else if (meeting.meetingDate < moment().format("L")) {
                    createTost({ title: "Meeting has ended", type: "danger" });
                    navigate(user ? "/" : "/login");
                  } else if (meeting.meetingDate > moment().format("L")) {
                    createTost({
                      title: `Meeting is on ${meeting.meetingDate}`,
                      type: "warning",
                    });
                    navigate(user ? "/" : "/login");
                  }
                } else {
                  navigate(user ? "/" : "/login");
                }
              } else if (meeting.meetingType === "group-meeting") {
                const index = meeting.invitedUsers.findIndex(
                  (invitedUser: string) => invitedUser === user?.uid
                );
                
                if (index !== -1 || isCreater) {
                  if (meeting.meetingDate === moment().format("L")) {
                    setIsAllowed(true);
                  } else if (meeting.meetingDate < moment().format("L")) {
                    createTost({ title: "Meeting has ended", type: "danger" });
                    navigate(user ? "/" : "/login");
                  } else if (meeting.meetingDate > moment().format("L")) {
                    createTost({
                      title: `Meeting is on ${meeting.meetingDate}`,
                      type: "warning",
                    });
                    navigate(user ? "/" : "/login");
                  }
                } else {
                  createTost({
                    title: "You are not invited to the meeting",
                    type: "danger",
                  });
                  navigate(user ? "/" : "/login");
                }
              } else {
                setIsAllowed(true);
              }
            } else {
              navigate("/");
            }
        }
      
    };
    getMeetingData();
  }, [params.meetingId, user, createTost, navigate, userLoaded]);

  const appId = parseInt(import.meta.env.VITE_ZEGOCLOUD_APP_ID);
  const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;

  const myMeeting = async (element: any) => {
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      params.meetingId as string,
      user.uid ? user.uid : generateMeetingID(),
      user.displayName ? user.displayName : generateMeetingID()
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      maxUsers: 50,
      sharedLinks: [
        {
          name: "Meeting link",
          url: `${import.meta.env.VITE_REACT_APP_HOST}/meetiva/joinmeeting/${
            params.meetingId
          }`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  };

  return (
    <div>
      <EuiHeader
        style={{ minHeight: "6vh" }}
        sections={[{ breadcrumbs: breadCrumbs }]}
      />
      {isAllowed ? (
        <div
          className="myCallContrainer"
          ref={myMeeting}
          style={{ width: "100%", height: "100vh" }}
        ></div>
      ) : (
        <> </>
      )}
    </div>
  );
}
