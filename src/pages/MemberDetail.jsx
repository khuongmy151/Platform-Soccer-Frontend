import { useNavigate, useParams } from "react-router-dom";
import { players } from "../mock_data";
import { FaRulerHorizontal } from "react-icons/fa";
import { GiWeightScale } from "react-icons/gi";
import { RiFootprintFill } from "react-icons/ri";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { MdPsychology } from "react-icons/md";
import { IoMdBatteryCharging } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { Progress } from "antd";

const MemberDetail = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const { memberId } = useParams();
  const memberWithId = players?.find((value) => value.id == memberId);
  const [firstName, lastName] = memberWithId?.name?.split(" ") || [];
  const playerInfo = [
    {
      title: "HEIGHT",
      icon: <FaRulerHorizontal className="text-brand-primary" />,
      value: memberWithId?.height + " " + "cm" || "Chưa xác định",
    },
    {
      title: "WEIGHT",
      icon: <GiWeightScale className="text-brand-primary" />,
      value: memberWithId?.weight + " " + "kg" || "Chưa xác định",
    },
    {
      title: "MAIN FOOT",
      icon: <RiFootprintFill className="text-brand-primary" />,
      value: memberWithId?.main_foot || "Chưa xác định",
    },
  ];
  const attributeRealTime = [
    {
      title: "REFLEX RESPONSE",
      icon: <AiOutlineThunderbolt className="text-green-900" />,
      progressBar: (
        <Progress percent={90} showInfo={false} strokeColor="#14532d" />
      ),
      value: "98.4 ms",
      textColor: "text-green-900",
    },
    {
      title: "TACTICAL AWARENESS",
      icon: <MdPsychology className="text-amber-900" />,
      progressBar: (
        <Progress percent={80} showInfo={false} strokeColor="#78350f" />
      ),
      value: "A GRADE",
      textColor: "text-amber-900",
    },
    {
      title: "NEURAL FATIGUE",
      icon: <IoMdBatteryCharging className="text-brand-primary" />,
      progressBar: (
        <Progress percent={20} showInfo={false} strokeColor="#c8102e" />
      ),
      value: "LOW",
      textColor: "text-brand-primary",
    },
  ];
  return (
    <>
      <div className="w-full bg-surface-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <button
            onClick={() => navigate(`/teams/${teamId}`)}
            className="flex items-center gap-2 text-surface-nav font-display font-bold uppercase tracking-widest text-label-lg hover:opacity-70 transition-all"
          >
            <FaArrowLeft size={14} /> BACK
          </button>
        </div>
        <div className="flex flex-col justify-between max-w-4xl h-[700px] bg-surface-bg">
          <div className="flex h-[41%] bg-surface-white overflow-hidden rounded-[12px]">
            <div className="w-[30%]">
              <img
                className="w-full h-full object-fill"
                src={memberWithId?.avatar}
                alt=""
              />
            </div>
            <div className="w-[70%]">
              <div className="w-[92%] h-[164px] mt-6 m-auto">
                <div className="flex flex-col">
                  <p className="text-title-md text-brand-primary font-bold">
                    MEMBER NAME
                  </p>
                  <p className="text-display-lg text-surface-nav font-extrabold">
                    {firstName || ""}
                  </p>
                  <p className="text-display-lg text-brand-primary font-extrabold">
                    {lastName || ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-end w-[92%] h-[67px] m-auto">
                <div>
                  <p className="text-label-sm text-nav-muted font-bold">
                    POSITION
                  </p>
                  <p className="text-title-lg text-surface-nav font-bold">
                    {memberWithId?.position}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between h-[55%]">
            <div className="flex flex-col justify-between w-[33%] h-[60%] py-6 px-1 bg-surface-white rounded-[12px]">
              <div className="w-[85%] mx-auto border-l-4 border-l-brand-primary">
                <p className="ms-4 text-title-sm text-nav-muted font-bold">
                  THÔNG TIN CƠ BẢN
                </p>
              </div>
              <div className="flex flex-col justify-between w-[85%] h-[75%] mx-auto">
                {playerInfo?.map((item, index) => {
                  return (
                    <div key={index} className="flex justify-between">
                      <div className="flex items-center gap-1">
                        <div className="p-2 rounded-[4px] bg-surface-bg">
                          {item.icon}
                        </div>
                        <p className="text-title-sm text-nav-muted font-medium">
                          {item.title}
                        </p>
                      </div>
                      <p className="text-body-lg text-surface-nav font-bold">
                        {item.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col justify-evenly w-[64%] h-[90%] rounded-[12px] bg-surface-white">
              <div className="w-[90%] mx-auto border-l-4 border-l-brand-primary">
                <p className="ms-4 text-title-sm text-nav-muted font-bold">
                  THUỘC TÍNH REALTIME
                </p>
              </div>
              <div className="flex flex-col justify-between w-[90%] h-[62%] mx-auto">
                {attributeRealTime?.map((item, index) => {
                  return (
                    <div key={index}>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                          {item.icon}
                          <p className="text-body-md text-nav-muted font-bold">
                            {item.title}
                          </p>
                        </div>
                        <p
                          className={`text-body-lg font-extrabold ${item.textColor}`}
                        >
                          {item.value}
                        </p>
                      </div>
                      {item.progressBar}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MemberDetail;
