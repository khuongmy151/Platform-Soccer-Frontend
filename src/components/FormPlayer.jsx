import { useMemo, useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FiTarget } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const EMPTY_PLAYER = {
  id: "",
  name: "",
  avatar: "",
  height: "",
  weight: "",
  preferred_foot: "LEFT",
  main_position: "",
};

const derivePlayer = (isEdit, player) => {
  if (!isEdit || !player) return EMPTY_PLAYER;
  return {
    id: player.id || "",
    name: player.name || "",
    avatar: player.avatar || "",
    height: player.height || "",
    weight: player.weight || "",
    preferred_foot: player.preferred_foot || "LEFT",
    main_position: player.position || player.main_position || "",
  };
};

const FormPlayer = ({ ref, mode = "add", player = null, onSubmit }) => {
  const isEdit = mode === "edit";
  const avatarRef = useRef();
  const sourceKey = `${mode}-${player?.id ?? "new"}`;
  const [prevKey, setPrevKey] = useState(sourceKey);
  const [formPlayer, setFormPlayer] = useState(() =>
    derivePlayer(isEdit, player)
  );

  if (prevKey !== sourceKey) {
    setPrevKey(sourceKey);
    setFormPlayer(derivePlayer(isEdit, player));
  }

  const avatarPreview = useMemo(() => {
    if (!formPlayer.avatar) return null;
    return typeof formPlayer.avatar === "object"
      ? URL.createObjectURL(formPlayer.avatar)
      : formPlayer.avatar;
  }, [formPlayer.avatar]);

  const handleChange = (key, val) =>
    setFormPlayer((prev) => ({ ...prev, [key]: val }));

  const handleClose = () => ref.current?.close();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formPlayer);
    handleClose();
  };

  return (
    <dialog
      ref={ref}
      className="w-[95%] md:w-[70%] lg:w-[60%] p-0 m-auto outline-none rounded-[20px] overflow-hidden backdrop:bg-black/40 backdrop:backdrop-blur-[2px] font-display"
    >
      <div className="relative flex flex-col md:flex-row bg-gradient-to-br from-[#fbe7d4] via-[#f5ecec] to-[#f0d5c8]">
        <button
          onClick={handleClose}
          aria-label="Close"
          type="button"
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-surface-white/80 text-surface-nav hover:scale-110 hover:cursor-pointer transition-transform duration-200"
        >
          <IoClose className="w-5 h-5" />
        </button>

        {/* LEFT: TITLE + AVATAR */}
        <div className="flex flex-col items-center md:items-start w-full md:w-[45%] p-8">
          <h2 className="text-display-sm font-extrabold text-surface-nav tracking-wide mb-8">
            {isEdit ? "EDIT PLAYER" : "ADD PLAYER"}
          </h2>
          <div className="relative w-full max-w-[320px] aspect-square rounded-[16px] overflow-hidden bg-surface-white shadow-lg">
            <input
              type="file"
              ref={avatarRef}
              onChange={(e) => handleChange("avatar", e.target.files[0])}
              className="hidden"
              accept=".png, .jpg, .jpeg"
            />
            {avatarPreview ? (
              <img
                src={avatarPreview}
                className="w-full h-full object-cover"
                alt="Player avatar"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-surface-black/40 text-body-md">
                No image
              </div>
            )}
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-surface-white rounded-full shadow-lg hover:scale-105 hover:cursor-pointer transition-transform duration-200"
            >
              <IoCloudUploadOutline className="w-4 h-4" />
              <span className="text-label-sm font-bold tracking-[0.15em] uppercase">
                Upload Profile
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full md:w-[55%] bg-surface-white p-8 md:p-10 rounded-t-[20px] md:rounded-t-none md:rounded-l-[20px]"
        >
          <div className="mb-6">
            <p className="text-label-sm text-surface-nav font-semibold tracking-[0.2em] uppercase mb-2">
              Player Credentials
            </p>
            <div className="w-16 h-1 bg-cta-gradient rounded-full" />
          </div>

          <div className="flex flex-col gap-6 font-body">
            <div className="flex flex-col">
              <label className="text-label-sm text-brand-primary font-bold tracking-[0.15em] uppercase mb-2">
                Name
              </label>
              <input
                type="text"
                value={formPlayer.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="NgocBich"
                className="w-full px-3 py-2 bg-surface-bg/60 outline-none border-b-2 border-transparent text-body-md text-surface-nav focus:border-brand-primary transition-colors rounded-t-[4px]"
              />
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col flex-1">
                <label className="text-label-sm text-brand-primary font-bold tracking-[0.15em] uppercase mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formPlayer.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                  placeholder="185"
                  className="w-full px-3 py-2 bg-surface-bg/60 outline-none border-b-2 border-transparent text-body-md text-surface-nav focus:border-brand-primary transition-colors rounded-t-[4px]"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-label-sm text-brand-primary font-bold tracking-[0.15em] uppercase mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formPlayer.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                  placeholder="78"
                  className="w-full px-3 py-2 bg-surface-bg/60 outline-none border-b-2 border-transparent text-body-md text-surface-nav focus:border-brand-primary transition-colors rounded-t-[4px]"
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col flex-1">
                <label className="text-label-sm text-brand-primary font-bold tracking-[0.15em] uppercase mb-2">
                  Preferred Foot
                </label>
                <div className="flex rounded-[8px] overflow-hidden border border-surface-bg">
                  {["LEFT", "RIGHT", "BOTH"].map((foot) => {
                    const active = formPlayer.preferred_foot === foot;
                    return (
                      <button
                        key={foot}
                        type="button"
                        onClick={() => handleChange("preferred_foot", foot)}
                        className={`flex-1 py-2 text-label-sm font-bold tracking-[0.1em] uppercase hover:cursor-pointer transition-colors ${
                          active
                            ? "bg-surface-white text-surface-nav shadow-sm"
                            : "bg-surface-bg/40 text-nav-muted hover:text-surface-nav"
                        }`}
                      >
                        {foot}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-label-sm text-brand-primary font-bold tracking-[0.15em] uppercase mb-2">
                  Main Position
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formPlayer.main_position}
                    onChange={(e) =>
                      handleChange("main_position", e.target.value)
                    }
                    placeholder="e.g. Center Forward"
                    className="w-full px-3 pr-10 py-2 bg-surface-bg/60 outline-none border-b-2 border-transparent text-body-md text-surface-nav focus:border-brand-primary transition-colors rounded-t-[4px]"
                  />
                  <FiTarget className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-10 w-full py-4 bg-brand-primary text-surface-white text-body-lg font-bold tracking-[0.2em] uppercase rounded-[8px] shadow-[0_10px_30px_-10px_rgba(200,16,46,0.8)] hover:scale-[1.02] hover:cursor-pointer transition-transform duration-200"
          >
            {isEdit ? "Save Player" : "Create Player"}
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default FormPlayer;
