
import Header from '../components/Header'
import useAuth from '../hooks/useAuth'
import meeting1 from "../assets/oneonone-meeting.png";
import meeting2 from "../assets/videoconference.png";
import { EuiCard, EuiFlexGroup, EuiFlexItem, EuiImage } from '@elastic/eui';
import {useNavigate} from 'react-router-dom'

function CreateMeeting() {
    useAuth();
    const navigate = useNavigate();
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
        alignItems="center"
        style={{ margin: "5vh 10vw" }}
      >
        <EuiFlexItem>
          <EuiCard
            icon={<EuiImage size="5rem" src={meeting1} alt="icon" />}
            title={`Create One on One Meeting`}
            description="Create a personal single person meeting"
            onClick={() => navigate("/create-1on1-meeting")}
            paddingSize="xl"
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiCard
            icon={<EuiImage size="5rem" src={meeting2} alt="icon" />}
            title={`Create Group Meeting`}
            description="Invite multiple persons to the meeting"
            onClick={() => navigate("/group-meeting")}
            paddingSize="xl"
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
}

export default CreateMeeting
