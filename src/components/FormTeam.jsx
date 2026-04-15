import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { teamService } from "../services/teamService";
import { updateTeam } from "../stores/features/teamSlice";
import { useEffect, useState } from "react";

const FormTeam = ({ ref }) => {
  const [_, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.teams);
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("teamId");
  const [teamWithId, setTeamWithId] = useState(null);
  const [formTeam, setFormTeam] = useState({
    id: "",
    logo_url: "",
    kit_url: [],
    name: "",
    country: "",
    description: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  // useEffect để đồng bộ dữ liệu khi teamId thay đổi
  useEffect(() => {
    if (teamId && teams?.items) {
      const foundTeam = teams.items.find((value) => value.id == teamId);
      if (foundTeam) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTeamWithId(foundTeam);
        setIsEdit(true);
        setFormTeam({
          id: teamWithId?.id || "",
          logo_url: teamWithId?.logo_url || "",
          kit_url: teamWithId?.kit_url || [],
          name: teamWithId?.name || "",
          country: teamWithId?.country || "",
          description: teamWithId?.description || "",
        });
        ref.current.showModal();
      }
    } else {
      // Nếu không có teamId, reset form và đóng modal
      setIsEdit(false);
      setFormTeam({
        id: "",
        logo_url: "",
        kit_url: [],
        name: "",
        country: "",
        description: "",
      });
      ref.current.close();
    }
  }, [teamId, teams?.items, ref, teamWithId]); // Quan trọng: Chỉ chạy khi ID hoặc Data thay đổi

  //Hàm xóa query string trên url
  const deleteQueryString = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (params.has("teamId")) params.delete("teamId");
      return params;
    });
  };

  //Hàm cập nhật team bên FE
  const handleUpdateTeam = (e) => {
    e.preventDefault();
    teamService.updateTeam({ team: formTeam, dispatch, func: updateTeam });
    alert("Cập nhật thành công");
    deleteQueryString();
  };
  return (
    <>
      <dialog
        className="w-[60%] p-5 m-auto bg-surface-bg outline-none backdrop:bg-black/20 backdrop:backdrop-blur-[2px] rounded-[12px]"
        ref={ref}
      >
        <h3 className="text-headline-md text-brand-primary font-bold text-center">
          {isEdit ? "UPDATE TEAM" : "CREATE TEAM"}
        </h3>
        <form
          className="flex justify-between h-[500px] mt-4"
          onSubmit={handleUpdateTeam}
        >
          <div className="flex flex-col justify-between w-[55%]">
            <div className="h-[42%] bg-surface-white rounded-[4px] border-b-3 border-b-brand-primary">
              <img
                className="w-full h-full object-contain"
                src={formTeam?.logo_url || null}
                alt=""
              />
            </div>
            <div className="flex justify-between h-[50%] border-b-3 border-b-brand-primary rounded-[4px]">
              {formTeam?.kit_url?.map((value, index) => {
                return (
                  <img
                    className="w-[48%] h-[85%] object-contain bg-surface-white rounded-[12px]"
                    key={index}
                    src={value || null}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex flex-col justify-between w-[42%] p-5 bg-surface-white rounded-[12px]">
            <div className="flex flex-col justify-between h-[200px] rounded-[12px]">
              {[
                {
                  title: "Team name",
                  key: "name",
                  value: `${teamWithId?.name}`,
                },
                {
                  title: "Nationality",
                  key: "country",
                  value: `${teamWithId?.country}`,
                },
                {
                  title: "Description",
                  key: "description",
                  value: `${teamWithId?.description}`,
                },
              ].map((item, index) => {
                return (
                  <div key={index}>
                    <label
                      className="text-body-md text-surface-nav font-bold"
                      htmlFor={item.title}
                    >
                      {item.title.toUpperCase()}
                    </label>
                    <input
                      onChange={(e) =>
                        setFormTeam({
                          ...formTeam,
                          [item.key]: e.target.value,
                        })
                      }
                      className="w-full outline-none border-b-2 border-b-surface-nav text-label-lg text-nav-muted"
                      type="text"
                      value={formTeam[item.key]}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 justify-end">
              <input
                onClick={() => deleteQueryString()}
                className="text-body-md text-nav-muted font-bold"
                type="button"
                value="CANCEL"
              />
              <button className="py-2 px-6 bg-cta-gradient text-body-md text-surface-white font-bold rounded-[8px] hover:cursor-pointer hover:text-surface-bg hover:scale-105 transition-transform duration-300">
                SAVE
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};
export default FormTeam;
