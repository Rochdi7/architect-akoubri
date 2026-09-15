/* Title block for the study on stage. `switching` hides it for the beat
   between one model being taken down and the next being assembled, so the
   copy changes while nothing is on the plinth. */
export default function ProjectInfo({ project, switching }) {
  return (
    <div className={`ss-info${switching ? ' is-switching' : ''}`}>
      <p className="ss-meta">{project.category}</p>
      <h3 className="ss-title">{project.title}</h3>
      {project.subtitle && <p className="ss-meta ss-sub">{project.subtitle}</p>}
      <p className="ss-meta">{project.location}</p>
      <p className="ss-note">{project.note}</p>
    </div>
  );
}
