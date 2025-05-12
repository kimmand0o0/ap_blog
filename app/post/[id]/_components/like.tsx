"use client";

import useStore from "@/hooks/use-store";
import { Like as TLike } from "@prisma/client";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface LikeProps {
  postId: string;
}

export default function Like({ postId }: LikeProps) {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const [isLiked, setIsLiked] = useState(false);
  const [like, setLike] = useState<TLike | null>(null);

  const getLike = async () => {
    if (!isLoggedIn) return setIsLiked(false);

    const response = await fetch(`/api/post/like/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return alert("조회에 실패했습니다. 잠시 후 다시 시도해주세요!");
    }

    const like = await response.json();

    if (like) {
      setIsLiked(true);
      setLike(like);
    }
    if (!like) setIsLiked(false);
  };

  const handleCreateLike = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스 입니다.");
      return;
    }

    const createLike = async () => {
      const response = await fetch(`/api/post/like/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return alert("좋아요에 실패했습니다. 잠시 후 다시 시도해주세요!");
      }

      const data = await response.json();

      setLike(data.like);
      setIsLiked(true);
    };

    createLike();
  };

  const handleDeleteLike = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스 입니다.");
      return;
    }

    if (!like) return setIsLiked(false);

    const deleteLike = async () => {
      const response = await fetch(`/api/like/${like.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return alert("좋아요 해제에 했습니다. 잠시 후 다시 시도해주세요!");
      }

      setIsLiked(false);
    };

    deleteLike();
  };

  useEffect(() => {
    getLike();
  }, []);

  return (
    <div className="w-full px-3 flex justify-end">
      <button
        onClick={() => {
          console.log("here");
          if (!isLiked) {
            return handleCreateLike();
          } else {
            return handleDeleteLike();
          }
        }}
      >
        {isLiked ? <FaHeart size={30} /> : <FaRegHeart size={30} />}
      </button>
    </div>
  );
}
