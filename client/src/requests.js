import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
} from "apollo-boost";
import gql from "graphql-tag";
const endPoints = `http://localhost:9000/graphql`;

const authLink = new ApolloLink((operation,forward)=>{
  if (!!localStorage.getItem("accessToken")) {
    operation.setContext({
      headers:{
        'authorization':`Bearer ${localStorage.getItem(
      "accessToken"
    )}`}
    })
  }
  return forward(operation)
});

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    new HttpLink({ uri: endPoints })]),
  cache: new InMemoryCache(),
});

export const graphqlQuery = async (query, variables = {}) => {
  const request = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query,
      variables,
    }),
  };
  if (!!localStorage.getItem("accessToken")) {
    request.headers["authorization"] = `Bearer ${localStorage.getItem(
      "accessToken"
    )}`;
  }
  const response = await fetch(endPoints, request)
    .then((response) => response.json())
    .then((data) => data);
  if (response?.error) {
    throw new Error("Graphql Error");
  }
  return response?.data;
};

export const createJob = async (input) => {
  const mutation = `mutation CreateJob($companyId: ID!,$title: String,$description: String){
 job: createJob(
    companyId: $companyId
    title: $title
    description: $description
  ) {
    id
    title
    description
    company {
      id
      name
    }
  }
}`;
  const { job } = await graphqlQuery(mutation, { ...input });
  return job;
};

export const loadCompany = async (id) => {
  const query = gql`
    query companyQuery($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
        }
      }
    }
  `;
  const {
    data: { company },
  } = await client.query({ query, variables: { id } });

  // const { company } = await graphqlQuery(query, { id });
  return company;
};

export const loadJob = async (id) => {
  const query = gql`
    query jobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        description
        company {
          id
          name
        }
      }
    }
  `;
  const {
    data: { job },
  } = await client.query({ query, variables: { id } });

  // const { job } = await graphqlQuery(query, { id });
  return job;
};

export const loadJobs = async () => {
  const query = gql`
    {
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;

  const {
    data: { jobs },
  } = await client.query({ query });
  return jobs;
};
