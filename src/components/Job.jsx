const logos = import.meta.glob("./images/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const Job = (props) => {
  const {
    company,
    contract,
    featured,
    languages,
    level,
    location,
    logo,

    position,
    postedAt,
    role,
    tools,
  } = props.data;

  const keywords = [role, level, ...languages, ...tools];
  const icon = logos[logo];

  return (
    <div
      className={
        featured ? "job-container job-container--borderLeft" : "job-container"
      }
    >
      <div className="logo">
        <img src={icon} alt="" />
      </div>
      <div className="part1">
        <div className="company">
          <span className="cname">{company}</span>
          {props.data.new && <span className="new">new!</span>}
          {props.data.featured && <span className="featured">featured</span>}
        </div>

        <div className="position">{position}</div>

        <div className="details">
          <span>{postedAt}</span>
          <span>&nbsp;•&nbsp;</span>
          <span>{contract}</span>
          <span>&nbsp;•&nbsp;</span>
          <span>{location}</span>
        </div>
      </div>

      <div className="part2">
        {keywords.map((key, id) => (
          <span onClick={() => props.setkeywords(key)} key={id}>
            {key}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Job;
