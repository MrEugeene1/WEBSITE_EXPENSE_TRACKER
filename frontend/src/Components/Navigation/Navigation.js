import React, { useEffect, useState } from "react";
import styled from "styled-components";
import profile from "../../img/profile.jpeg";
import { menuItems } from "../../utils/menuItems";
import { signout } from "../../utils/Icons";
import { jwtDecode } from "jwt-decode"; 
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/";

function Navigation({ active, setActive }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        // Fetch user details from the backend
        const fetchUserName = async () => {
          try {
            const response = await axios.get(`${BASE_URL}user/${userId}`);
            setUserName(response.data.name || "User");
          } catch (error) {
            console.error("Error fetching user details:", error);
            setUserName("User"); // Fallback in case of error
          }
        };

        fetchUserName();
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <NavStyled>
      <div className="user-con">
        <img src={profile} alt="profile" />
        <div className="text">
          <h2>{userName}</h2> 
          <p>Your Money</p>
        </div>
      </div>
      <ul className="menu-items">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActive(item.id)}
            className={active === item.id ? "active" : ""}
          >
            {item.icon}
            <span>{item.title}</span>
          </li>
        ))}
      </ul>
      <div className="bottom-nav">
        <li>{signout} Sign Out</li>
      </div>
    </NavStyled>
  );
}

const NavStyled = styled.nav`
  padding: 2rem 1.5rem;
  width: 374px;
  height: 100%;
  background: rgba(252, 246, 249, 0.78);
  border: 3px solid #ffffff;
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;

  .user-con {
    height: 100px;
    display: flex;
    align-items: center;
    gap: 1rem;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      background: #fcf6f9;
      border: 2px solid #ffffff;
      padding: 0.2rem;
      box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
    }
    h2 {
      color: rgba(34, 34, 96, 1);
    }
    p {
      color: rgba(34, 34, 96, 0.6);
    }
  }

  .menu-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    li {
      display: grid;
      grid-template-columns: 40px auto;
      align-items: center;
      margin: 0.6rem 0;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.4s ease-in-out;
      color: rgba(34, 34, 96, 0.6);
      padding-left: 1rem;
      position: relative;
      i {
        color: rgba(34, 34, 96, 0.6);
        font-size: 1.4rem;
        transition: all 0.4s ease-in-out;
      }
    }
    .active {
      color: rgba(34, 34, 96, 1) !important;
      i {
        color: rgba(34, 34, 96, 1) !important;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background: #222260;
        border-radius: 0 10px 10px 0;
      }
    }
  }

  .bottom-nav {
    li {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: rgba(34, 34, 96, 0.6);
      transition: all 0.4s ease-in-out;
      i {
        color: rgba(34, 34, 96, 0.6);
        font-size: 1.4rem;
        transition: all 0.4s ease-in-out;
      }
      &:hover {
        color: rgba(34, 34, 96, 1);
        i {
          color: rgba(34, 34, 96, 1);
        }
      }
    }
  }
`;

export default Navigation;
