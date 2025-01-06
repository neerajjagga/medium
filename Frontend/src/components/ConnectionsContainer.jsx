import React, { useEffect, useState } from "react";
import { useProfileStore } from "../store/useProfileStore";
import { debounce, deleteArrayElement, formatFollowers } from "../lib/utils";
import { ChevronRight, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

const ConnectionsContainer = ({ connectionType, profileData }) => {
  const {
    users,
    getConnectionUsers,
    isUsersFetched,
    allUsersFetched,
    isGettingUsers,
    followUser,
    unfollowUser,
  } = useProfileStore();

  const { authUser } = useAuthStore();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [followingUsersIds, setFollowingUsersIds] = useState([]);

  useEffect(() => {
    window.addEventListener("scroll", debounce(handlePageScroll, 75));
    return () => {
      window.removeEventListener("scroll", debounce(handlePageScroll, 75));
      setFollowingUsersIds([]);
    };
  }, []);

  useEffect(() => {
    if (loading === true) {
      getConnectionUsers(connectionType, profileData.username, page);
    }
    return () => setLoading(false);
  }, [page]);

  useEffect(() => {
    if (loading === true && !allUsersFetched) {
      setPage((prevValue) => prevValue + 1);
    }
  }, [loading]);

  useEffect(() => {
    if (users.length) {
      setFollowingUsersIds(
        users
          .filter((user) => authUser.following.includes(user._id))
          .map((user) => user._id)
      );
    }
  }, [users]);

  const handlePageScroll = (e) => {
    if (
      document.body.scrollHeight - 537 <
      window.scrollY + window.innerHeight
    ) {
      if (loading === false) {
        setLoading(true);
      }
    }
  };

  const handleClick = async (userId, username) => {
    if (followingUsersIds.includes(userId)) {
      await unfollowUser(username);
      setFollowingUsersIds([...deleteArrayElement(followingUsersIds, userId)]);
    } else {
      await followUser(username);
      setFollowingUsersIds([...followingUsersIds, userId]);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-[0.8rem] capitalize">
          <Link
            to={`/${profileData.username}`}
            className="text-neutral-600 hover:text-black"
          >
            {profileData.name}
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-black">{connectionType}</span>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight capitalize">
          {formatFollowers(profileData[connectionType + "Count"])}{" "}
          {connectionType}
        </h1>
      </div>
      <div className="border-solid border-t-[1px] border-gray-200 pt-8">
        {isGettingUsers && (
          <div className="flex justify-center items-center mt-16">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}
        {isUsersFetched && users.length ? (
          <ul className="flex flex-col gap-7">
            {users.map((user, index) => {
              return (
                <li
                  className="flex items-center gap-5 justify-between"
                  key={index}
                >
                  <div>
                    <Link
                      to={`/${user.username}`}
                      className="flex gap-4 items-start"
                    >
                      <img
                        src={user.profileImgUrl}
                        alt={user.name}
                        className="size-[3rem] object-cover"
                      />
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-[0.9rem] capitalize font-semibold tracking-tight">
                          {user.name}
                        </h4>
                        <p
                          className="text-[0.8rem] text-neutral-700 tracking-tight"
                          style={{ wordSpacing: -0.5 }}
                        >
                          {user.bio}
                        </p>
                      </div>
                    </Link>
                  </div>
                  {!(user._id === authUser._id) && (
                    <button
                      className={`text-[0.775rem] px-3 py-1 border-solid border-[1px] border-green-700 rounded-3xl ${
                        followingUsersIds.includes(user._id)
                          ? "bg-white text-green-700 hover:bg-gray-200"
                          : "bg-green-700 text-white hover:bg-green-800"
                      }`}
                      onClick={() => handleClick(user._id, user.username)}
                    >
                      {followingUsersIds.includes(user._id)
                        ? "Following"
                        : "Follow"}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <h3 className="mt-4 text-base text-neutral-800 font-semibold">
            No {connectionType} found!
          </h3>
        )}
      </div>
    </div>
  );
};

export default ConnectionsContainer;
