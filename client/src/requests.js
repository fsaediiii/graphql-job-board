const endPoints = `http://localhost:9000/graphql`;

export const graphqlQuery = async (query, variables = {}) => {
  const response = await fetch(endPoints, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((response) => response.json())
    .then((data) => data);
  if (response?.error) {
  throw new Error('Graphql Error')
  }
  return response?.data;
};

export const loadCompany = async (id) => {
  const query = `query companyQuery($id: ID!){
    company(id: $id){
      id,
      name,
      description,
      jobs{
        id,
        title
      }
    }
  }`;
  const { company } = await graphqlQuery(query, { id });
  return company;
};

export const loadJob = async (id) => {
  const query = `query jobQuery($id: ID!){
    job(id: $id){
      id,
      title,
      description,
      company{
        id,
        name
      }
      
    }
  }`;
  const { job } = await graphqlQuery(query, { id });
  return job;
};

export const loadJobs = async () => {
  const query = `{  
    jobs{
      id,
      title,
        company {
          id,
          name,
        }
      }
    }`;
  const { jobs } = await graphqlQuery(query);
  return jobs;
};
