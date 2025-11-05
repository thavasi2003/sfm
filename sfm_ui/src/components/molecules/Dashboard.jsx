import Layout from "./Layout/Layout";

const Home = () => {
  return (
    <Layout>
      <div style={{ width: "100%", height: "100vh" }}>
        <iframe
          title="SFM Demo"
          src="https://app.powerbi.com/view?r=eyJrIjoiOTQ2MWM5ZDMtZDZjYy00NGQ3LWFjYzAtYzBjODQyMzQ4NzIyIiwidCI6ImMyN2JhMWY2LTk5YTUtNDc1OC1iMDdmLTdhZDZjZTk4MDdlNCIsImMiOjEwfQ%3D%3D"
          style={{ border: "none", width: "100%", height: "100%" }}
          allowFullScreen
        ></iframe>
      </div>
    </Layout>
  );
};

export default Home;
