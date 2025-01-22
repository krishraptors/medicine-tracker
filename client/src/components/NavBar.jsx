/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md z-50">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold">
          <NavLink to="/" className="hover:text-green-400">
            Medicine Tracker
          </NavLink>
        </h1>
        <button
          className="text-2xl sm:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <FaTimes className="text-white" />
          ) : (
            <FaBars className="text-white" />
          )}
        </button>
        <ul className="hidden sm:flex space-x-6 text-lg font-medium">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-green-400 font-bold" : "hover:text-gray-300"
              }
            >
              Medicine Schedule
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/logs"
              className={({ isActive }) =>
                isActive ? "text-green-400 font-bold" : "hover:text-gray-300"
              }
            >
              Logs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                isActive ? "text-green-400 font-bold" : "hover:text-gray-300"
              }
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </div>

      {isOpen && (
        <div className="sm:hidden bg-gray-900 py-4 px-6">
          <ul className="space-y-4 text-lg font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-green-400 font-bold" : "hover:text-gray-300"
                }
                onClick={toggleMenu}
              >
                Medicine Schedule
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/logs"
                className={({ isActive }) =>
                  isActive ? "text-green-400 font-bold" : "hover:text-gray-300"
                }
                onClick={toggleMenu}
              >
                Logs
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/logout"
                className={({ isActive }) =>
                  isActive ? "text-green-400 font-bold" : "hover:text-gray-300"
                }
                onClick={toggleMenu}
              >
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
