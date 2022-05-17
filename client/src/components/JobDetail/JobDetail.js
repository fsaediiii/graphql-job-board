import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
const { loadJob } = require("../../requests");

export const JobDetail=(props)=> {
  const {jobId} = props.match.params;
  const [state, setState] = useState();

    useEffect(() => {
      (async () => {
        try {
          const data = await loadJob(jobId);
          setState(data)
        } catch (e) {}
      })();
    }, []);
    return (
      <div>
        <h1 className="title">{state?.title}</h1>
         <h2 className="subtitle">
          <Link to={`/companies/${state?.company?.id}`}>{state?.company?.name}</Link>
        </h2>
        <div className="box">{state?.description}</div> 
      </div>
    );
  }
