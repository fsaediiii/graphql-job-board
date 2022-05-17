import React, { useEffect, useState } from "react";
import { JobList } from "../../JobList";
const { loadJobs } = require("../../requests");

export const JobBoard = () => {
  const [jobs, setJobs] = useState();

  useEffect(() => {
    (async () => {
      try {
        const data = await loadJobs();
        setJobs(data)
      } catch (e) {}
    })();
  }, []);
  return (
    <div>
      <h1 className="title">Job Board</h1>
      {jobs && <JobList jobs={jobs} />}
    </div>
  );
};
