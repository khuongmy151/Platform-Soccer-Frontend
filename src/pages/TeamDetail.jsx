import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { IoIosPersonAdd } from "react-icons/io";
import { toast } from "react-toastify";
import { teamService } from "../services/teamService";
import {
  createPlayer,
  removePlayer,
  updatePlayer,
} from "../services/playerService";
import { players as mockPlayers } from "../mock_data";
import { MdGroup } from "react-icons/md";
import { FaPen, FaTrash, FaArrowLeft } from "react-icons/fa";
import FormPlayer from "../components/FormPlayer";
import ConfirmDialog from "../components/ConfirmDialog";

const TeamDetail = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [playersList, setPlayersList] = useState(mockPlayers);
  const playerFormRef = useRef(null);
  const confirmRef = useRef(null);
  const [formMode, setFormMode] = useState("add");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerToDelete, setPlayerToDelete] = useState(null);

  useEffect(() => {
    teamService.getTeamById({ url: `/teams/${teamId}`, setData: setTeam });
  }, [teamId]);

  const openAddPlayer = () => {
    setFormMode("add");
    setSelectedPlayer(null);
    playerFormRef.current?.showModal();
  };

  const openEditPlayer = (player) => {
    setFormMode("edit");
    setSelectedPlayer(player);
    playerFormRef.current?.showModal();
  };

  const openDeleteConfirm = (player) => {
    setPlayerToDelete(player);
    confirmRef.current?.showModal();
  };

  const handleConfirmDelete = async () => {
    if (!playerToDelete) return;
    try {
      await removePlayer(playerToDelete.id);
      toast.success(`Đã xóa cầu thủ ${playerToDelete.name}`);
    } catch (error) {
      console.log("Lỗi khi xóa cầu thủ", error);
      toast("Lỗi xử lý ở server, tạm thời xóa ở phía Frontend");
    }
    setPlayersList((prev) =>
      prev.filter((p) => p.id !== playerToDelete.id)
    );
    setPlayerToDelete(null);
    confirmRef.current?.close();
  };

  const handleSubmitPlayer = async (data) => {
    const avatarUrl =
      data.avatar && typeof data.avatar === "object"
        ? URL.createObjectURL(data.avatar)
        : data.avatar;

    const payload = {
      name: data.name,
      height: Number(data.height) || 0,
      weight: Number(data.weight) || 0,
      preferredFoot: data.preferred_foot,
      mainPosition: data.main_position,
      avatarUrl,
    };

    if (formMode === "edit") {
      try {
        await updatePlayer(data.id, payload);
        toast.success(`Đã cập nhật cầu thủ ${data.name}`);
      } catch (error) {
        console.log("Lỗi cập nhật cầu thủ", error);
        toast("Lỗi xử lý ở server, tạm thời cập nhật ở phía Frontend");
      }
      setPlayersList((prev) =>
        prev.map((p) =>
          p.id === data.id
            ? {
                ...p,
                name: data.name,
                position: data.main_position,
                avatar: avatarUrl,
              }
            : p
        )
      );
    } else {
      let newId = `p${Date.now()}`;
      try {
        const created = await createPlayer(payload);
        newId = created?.id || newId;
        toast.success(`Đã thêm cầu thủ ${data.name}`);
      } catch (error) {
        console.log("Lỗi thêm cầu thủ", error);
        toast("Lỗi xử lý ở server, tạm thời thêm ở phía Frontend");
      }
      setPlayersList((prev) => [
        ...prev,
        {
          id: newId,
          name: data.name,
          position: data.main_position,
          avatar: avatarUrl,
        },
      ]);
    }
  };

  return (
    <>
      <div className="flex flex-col rounded-3xl py-6 bg-surface-white" >
        {/* TOP TITLE */}
        <div className="flex items-center justify-between w-[90%] h-[60px] mx-auto my-0">
          <div className="w-[90%]">
            <p className="text-display-md font-extrabold text-surface-nav">
              TEAMS
            </p>
            <div className="w-[9%] h-1 bg-cta-gradient"></div>
          </div>
          <button
            onClick={() => navigate("/teams")}
            aria-label="Back"
            className="flex items-center justify-center w-11 h-11 bg-surface-nav text-surface-white rounded-full hover:cursor-pointer hover:scale-110 transition-transform duration-300"
          >
            <FaArrowLeft className="w-[16px] h-[16px]" />
          </button>
        </div>
        <div className="w-[90%] mx-auto overflow-hidden rounded-[12px]">
            <div className="bg-surface-white rounded-[12px] p-6">
              <div className="flex items-center justify-evenly h-[185px] bg-surface-white">
              <div className="flex items-center w-[65%] h-[120px]">
                <img
                  className="rounded-[12px]"
                  src={team?.logo_url}
                  alt=""
                  width={96}
                  height={96}
                />
                <div className="px-5">
                  <p className="text-headline-md text-surface-nav font-bold">
                    {team?.name}
                  </p>
                  <p>{team?.description}</p>
                </div>
              </div>
              <div className="flex items-end justify-between py-4 w-[30%] h-full">
                {team?.kit_url?.map((value, index) => {
                  return (
                    <img
                      className="w-[50%] h-full object-contain"
                      key={index}
                      src={value}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between h-[48px]">
              <div className="flex items-center gap-2">
                <MdGroup className="w-[24px] text-brand-primary" />
                <p className="text-headline-sm text-surface-nav font-extrabold tracking-wide">
                  PLAYERS
                </p>
              </div>
              <button
                onClick={openAddPlayer}
                className="flex items-center gap-2 px-4 py-2 bg-surface-white border border-surface-bg rounded-[9999px] shadow-sm hover:cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <IoIosPersonAdd className="w-[20px] text-surface-nav" />
                <p className="text-body-md font-semibold text-surface-nav">
                  Add New Player
                </p>
              </button>
            </div>
            <div className="h-px bg-surface-bg my-6" />
            <ul className="flex flex-wrap gap-6">
              {playersList?.map((value, index) => {
                return (
                  <li
                    key={index}
                    className="group relative flex flex-col w-[calc((100%-72px)/4)] rounded-[10px] overflow-hidden bg-surface-nav shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-[220px] w-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        src={value.avatar}
                        alt={value.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-nav via-surface-nav/40 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-label-sm text-surface-white/70 font-semibold tracking-[0.15em] uppercase">
                          {index === 0 ? "CAPTAIN" : value.position}
                        </p>
                        <p className="text-headline-sm text-surface-white font-extrabold">
                          {value.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-surface-white px-4 py-3">
                      <div>
                        <p className="text-label-sm text-nav-muted font-semibold tracking-[0.15em] uppercase">
                          POSITION
                        </p>
                        <p className="text-body-md text-surface-nav font-bold">
                          {value.position}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          aria-label="Edit"
                          onClick={() => openEditPlayer(value)}
                          className="flex items-center justify-center w-9 h-9 text-surface-white bg-cta-gradient rounded-full hover:cursor-pointer hover:scale-110 transition-transform duration-200"
                        >
                          <FaPen className="w-[14px] h-[14px]" />
                        </button>
                        <button
                          aria-label="Remove"
                          onClick={() => openDeleteConfirm(value)}
                          className="flex items-center justify-center w-9 h-9 text-surface-white bg-brand-primary rounded-full hover:cursor-pointer hover:scale-110 transition-transform duration-200"
                        >
                          <FaTrash className="w-[14px] h-[14px]" />
                        </button>
                      </div>
                    </div>
                    <div className="h-1 bg-cta-gradient" />
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-end mt-4">
              <div className="text-right">
                <p className="text-label-sm text-nav-muted font-semibold tracking-[0.15em] uppercase">
                  TOTAL
                </p>
                <p className="text-headline-md text-surface-nav font-extrabold">
                  {playersList?.length}
                  <span className="text-nav-muted font-semibold"> / 11</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FormPlayer
        ref={playerFormRef}
        mode={formMode}
        player={selectedPlayer}
        onSubmit={handleSubmitPlayer}
      />
      <ConfirmDialog
        ref={confirmRef}
        message={
          playerToDelete
            ? `Bạn có chắc chắn muốn xóa cầu thủ "${playerToDelete.name}"?`
            : ""
        }
        handleConfirm={handleConfirmDelete}
      />
    </>
  );
};
export default TeamDetail;
