import { IoLocationOutline, IoCalendarOutline } from "react-icons/io5";

const JobListCard = ({ job, id }) => {
  return (
    <div className={"flex items-center p-4  w-full"}>
      <img
        src={job.image}
        alt="company logo"
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="ml-4 w-full">
        <h2 className="text-xl font-bold text-gray-700">{job.name}</h2>
        <p className="text-md font-semibold text-slate-gray">{job.role}</p>
        <div className="flex justify-between w-full ">
          <p className="text-sm font-semibold text-custom-red ">{job.type}</p>
          <div className="flex gap-4">
            <div className="flex items-center">
              <IoLocationOutline className="text-slate-gray" />
              <p className="text-sm font-medium text-slate-gray ml-1">
                {job.location}
              </p>
            </div>
            <div className="flex items-center col-span-2">
              <IoCalendarOutline className="text-slate-gray" />
              <p className="text-sm font-medium text-slate-gray ml-1">
                {job.duration}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListCard;
