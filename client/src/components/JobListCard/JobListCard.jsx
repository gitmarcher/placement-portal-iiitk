import { IoLocationOutline, IoCalendarOutline } from "react-icons/io5";

const JobListCard = ({ job }) => {
  // Handle location as either an array or a single value
  const locationDisplay = Array.isArray(job.location)
    ? job.location.join(", ")
    : job.location || "Not specified";

  return (
    <div className="flex items-center p-4 w-full">
      <img
        src={job.company_logo || "/default-logo.png"}
        alt={job.company_name || "Company"}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="ml-4 w-full">
        <h2 className="text-xl font-bold text-gray-700">
          {job.company_name || "Unknown Company"}
        </h2>
        <p className="text-md font-semibold text-slate-gray">
          {job.drive_name || "Unknown Position"}
        </p>
        <div className="flex justify-between w-full">
          <p className="text-sm font-semibold text-custom-red">
            {job.type_of_role || "Unknown Type"}
          </p>
          <div className="flex gap-4">
            <div className="flex items-center">
              <IoLocationOutline className="text-slate-gray" />
              <p className="text-sm font-medium text-slate-gray ml-1">
                {locationDisplay}
              </p>
            </div>
            <div className="flex items-center col-span-2">
              <IoCalendarOutline className="text-slate-gray" />
              <p className="text-sm font-medium text-slate-gray ml-1">
                {job.duration || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListCard;
