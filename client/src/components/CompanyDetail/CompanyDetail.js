import React, { useState, useEffect } from "react";
import { JobList } from "../../JobList";
const { loadCompany } = require("../../requests");

export const CompanyDetail = (props) => {
  const { companyId } = props.match.params;

  const [state, setState] = useState();

  useEffect(() => {
    (async () => {
      try {
        const data = await loadCompany(companyId);
        setState(data);
      } catch (e) {}
    })();
  }, []);

  return (
    <div>
      <h1 className="title">{state?.name}</h1>
      <div className="box">{state?.description}</div>
      <h5 className="title is-5">Job at {state?.name}</h5>
      {state && state.jobs && <JobList jobs={state.jobs} />}
    </div>
  );
};
