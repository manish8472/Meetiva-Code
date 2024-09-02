import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import {
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHeader,
  EuiText,
  EuiTextColor,
} from "@elastic/eui";

import { signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/FirebaseConfig";
import { changeTheme } from "../app/slices/AuthSlice";
import {
  getCreate1On1MeetingBreadCrumbs,
  getCreateGroupMeetingBreadCrumbs,
  getCreateMeetingBreadCrumbs,
  getMeetingBreadCrumbs,
  getMyMeetingBreadCrumbs,
} from "../utils/BreadCrumbs";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = useAppSelector((user) => user.auth.userInfo?.name);
  const [isDarkTheme, setIsDarkTheme] = useState(
    useAppSelector((user) => user.auth.isDarkTheme)
  );
  const [breadCrubs, setBreadCrumbs] = useState([{ text: "Dashboard" }]);
  const [isResponsive, setIsResponsive] = useState(false);
  const dispatch = useDispatch();
  
  // logout function to signout from firebase when logout button is clicked
  const logout = async () => {
    await signOut(firebaseAuth);
    navigate("/login");
  };

  // set bread crumb according to url
  useEffect(() => {
    const { pathname } = location;
    if (pathname == "/create-meeting") {
      setBreadCrumbs(getCreateMeetingBreadCrumbs(navigate));
    } else if (pathname == "/create-1on1-meeting") {
      setBreadCrumbs(getCreate1On1MeetingBreadCrumbs(navigate));
    } else if (pathname == "/group-meeting") {
      setBreadCrumbs(getCreateGroupMeetingBreadCrumbs(navigate));
    } else if (pathname == "/my-meetings") {
      setBreadCrumbs(getMyMeetingBreadCrumbs(navigate));
    } else if (pathname == "/meetings") {
      setBreadCrumbs(getMeetingBreadCrumbs(navigate));
    }
  }, [location, navigate]);
  
  // fetch theme from local storage and set it in redux store and state of app component
  // change theme as well as local storage as well as invert the theme
  const invertTheme = () => {
    const theme = localStorage.getItem("zoom-theme");
    localStorage.setItem("zoom-theme", theme === "light" ? "dark" : "light");
    dispatch(changeTheme({ isDarkTheme: !isDarkTheme }));
    setIsDarkTheme(!isDarkTheme);
  };

  // This is header show when screen size is greater than 500px
  const section = [
    {
      items: [
        <Link to="/">
          <EuiText>
            <h2 style={{ padding: "0 1vw" }}>
              <EuiTextColor color="#0b5cff">Meetiva</EuiTextColor>
            </h2>
          </EuiText>
        </Link>,
      ],
    },
    {
      items: [
        <>
          {username ? (
            <EuiText>
              {" "}
              <h3>
                {" "}
                <EuiTextColor color="white">Hello,</EuiTextColor>
                <EuiTextColor color="#0b5cff">{username}</EuiTextColor>
              </h3>
            </EuiText>
          ) : null}
        </>,
      ],
    },

    {
      items: [
        <EuiFlexGroup
          justifyContent="center"
          alignItems="center"
          direction="row"
          style={{ gap: "2vw" }}
        >
          <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
            {isDarkTheme && (
              <EuiButtonIcon
                onClick={invertTheme}
                iconType="sun"
                color="warning"
                display="fill"
                size="s"
                aria-label="invert theme button"
                title="Theme Change"
              />
            )}{" "}
            {""}
            {!isDarkTheme && (
              <EuiButtonIcon
                iconType="moon"
                onClick={invertTheme}
                color="accent"
                display="fill"
                size="s"
                aria-label="invert theme button"
                title="Theme Change"
              />
            )}
          </EuiFlexItem>
          <EuiFlexItem
            grow={false}
            style={{ flexBasis: "fit-content" }}
            onClick={logout}
          >
            <EuiButtonIcon
              title="Logout"
              iconType="exit"
              display="fill"
              size="s"
              aria-label="logout button"
            />
          </EuiFlexItem>
        </EuiFlexGroup>,
      ],
    },
  ];

  // This is header show when screen size is less than 500px 
  const responsiveSection = [
    {
      items: [
        <Link to="/">
          <EuiText>
            <h2 style={{ padding: "0 1vw" }}>
              <EuiTextColor color="#0b5cff">Meetiva</EuiTextColor>
            </h2>
          </EuiText>
        </Link>,
      ],
    },

    {
      items: [
        <EuiFlexGroup
          justifyContent="center"
          alignItems="center"
          direction="row"
          style={{ gap: "2vw" }}
        >
          <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
            {isDarkTheme ? (
              <EuiButtonIcon
                onClick={invertTheme}
                iconType="sun"
                color="warning"
                display="fill"
                size="s"
                aria-label="invert theme button"
                title="Theme Change"
              />
            ) : (
              <EuiButtonIcon
                iconType="moon"
                onClick={invertTheme}
                color="accent"
                display="fill"
                size="s"
                aria-label="invert theme button"
                title="Theme Change"
              />
            )}
          </EuiFlexItem>
          <EuiFlexItem
            grow={false}
            style={{ flexBasis: "fit-content" }}
            onClick={logout}
          >
            <EuiButtonIcon
              title="Logout"
              iconType="exit"
              display="fill"
              size="s"
              aria-label="Logout button"
            />
          </EuiFlexItem>
        </EuiFlexGroup>,
      ],
    },
  ];

  // function to resize the header according to screen size
  const handleResize = () => {
    setIsResponsive(window.innerWidth <= 500 ? true : false);
  };

  // This is run on only one time when component is loaded
  useEffect(() => {
    // Add event listener on component mount
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
  // function to set the header according to screen size when page is changed or component is changed
  useLayoutEffect(() => {
    setIsResponsive(window.innerWidth <= 500 ? true : false);
  }, []);

 
  
  return (
    <div>
      <EuiHeader
        style={{ minHeight: "8vh" }}
        theme="dark"
        sections={isResponsive ? responsiveSection : section}
      />
      {/* this is for showing breadcrumbs  */}
      <EuiHeader
        style={{ minHeight: "6vh" }}
        sections={[{ breadcrumbs: breadCrubs }]}
      />
    </div>
  );
}

export default Header;
