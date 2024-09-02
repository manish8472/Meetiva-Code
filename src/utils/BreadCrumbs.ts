import { NavigateFunction } from "react-router-dom";
import { BreadCrumbsType } from "./Type";

export const getCreateMeetingBreadCrumbs = (
  navigate: NavigateFunction
): Array<BreadCrumbsType> => [
  {
    text: "DashBoard",
    href: "#",
    onClick: () => {
      navigate("/");
    },
  },
  {
    text: "Create Meeting",
  },
];

export const getCreate1On1MeetingBreadCrumbs = (
  navigate: NavigateFunction
): Array<BreadCrumbsType> => [
  {
    text: "DashBoard",
    href: "#",
    onClick: () => {
      navigate("/");
    },
  },
  {
    text: "Create Meeting",
    href:"#",
    onClick:() =>{
      navigate("/create-meeting");
    }
  },
  {
    text:"Create-1-On-1-Meeting",
  }
];

export const getCreateGroupMeetingBreadCrumbs = (
  navigate: NavigateFunction
): Array<BreadCrumbsType> => [
  {
    text: "DashBoard",
    href: "#",
    onClick: () => {
      navigate("/");
    },
  },
  {
    text: "Create Meeting",
    href:"#",
    onClick:() =>{
      navigate("/create-meeting");
    }
  },
  {
    text:"Group Meeting",
  }
];
export const getMyMeetingBreadCrumbs = (
  navigate: NavigateFunction
): Array<BreadCrumbsType> => [
  {
    text: "DashBoard",
    href: "#",
    onClick: () => {
      navigate("/");
    },
  },
  {
    text: "My Meeting",
  },
  
];
export const getMeetingBreadCrumbs = (
  navigate: NavigateFunction
): Array<BreadCrumbsType> => [
  {
    text: "DashBoard",
    href: "#",
    onClick: () => {
      navigate("/");
    },
  },
  {
    text: "Meeting",
  },
  
];

export const getJoinMeetingBreadCrumbs = (
 
): Array<BreadCrumbsType> => [
  {
    text: "DashBoard",
    href: import.meta.env.VITE_REACT_APP_HOST,
  },
  {
    text: "Video Call",
  },
];


