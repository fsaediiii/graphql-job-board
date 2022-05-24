import React, { useState } from 'react';
const { createJob } = require("../../requests");

export const JobForm=(props)=> {
  const [state, setState] = useState({
    title:'',
    description:''
  });
  
  function handleChange(event) {
    const {name, value} = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

 async function handleClick (event) {
    event.preventDefault();
    const companyId='SJV0-Wd0M'
   const response=await createJob({companyId,title:state.title,description:state.description})
   if(response){
    props.history.push(`/jobs/${response.id}`)
   }
    console.log('should post a new job:', response);
  }

    const {title, description} = state;
    return (
      <div>
        <h1 className="title">New Job</h1>
        <div className="box">
          <form>
            <div className="field">
              <label className="label">Title</label>
              <div className="control">
                <input className="input" type="text" name="title" value={title} 
                  onChange={handleChange} />
              </div>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea className="input" style={{height: '10em'}}
                  name="description" value={description} onChange={handleChange} />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button className="button is-link" onClick={handleClick}>Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
