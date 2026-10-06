import Job from "./Job.jsx";

const Jobs = ({ data, setKeywords, keywords }) => {
  // console.log(data);

  // const SearchFunc = () => {
  //   if (keywords.length > 0) {
  //     const newData = filteredData.filter((d) => {
  //       return d.position.toLocaleLowerCase().includes(keywords);
  //     });
  //     setfilteredData(newData);
  //   } else {
  //     setfilteredData(data);
  //   }
  // };

  const filteredData = keywords
    ? data.filter((d) =>
        keywords.every(
          (key) =>
            d.role === key ||
            d.level === key ||
            d.languages.includes(key) ||
            d.tools.includes(key)
        )
      )
    : data;

  return (
    <div className="jobs">
      {filteredData.map((d) => {
        return <Job key={d.id} data={d} setkeywords={setKeywords} />;
      })}
    </div>
  );
};

export default Jobs;
