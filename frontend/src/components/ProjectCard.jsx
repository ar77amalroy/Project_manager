'use client';

const STATUS_STYLES = {
  active: 'badge badge-active',
  inactive: 'badge badge-inactive',
  completed: 'badge badge-completed',
};

const STATUS_DOTS = {
  active: '●',
  inactive: '○',
  completed: '✓',
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const truncatedDescription =
    project.description.length > 120
      ? `${project.description.slice(0, 120)}…`
      : project.description;

  const formattedDate = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="glass-card p-6 flex flex-col gap-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate" style={{ color: 'var(--foreground)' }} title={project.name}>
            {project.name}
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            by {project.ownerId}
          </p>
        </div>
        <span className={STATUS_STYLES[project.status] || 'badge badge-inactive'}>
          <span className="text-[10px]">{STATUS_DOTS[project.status]}</span>
          {project.status}
        </span>
      </div>

      <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
        {truncatedDescription}
      </p>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Updated {formattedDate}
        </span>
        <div className="flex gap-2">
          <button
            id={`edit-project-${project.id}`}
            onClick={() => onEdit(project)}
            className="btn-icon"
            title="Edit project"
            style={{ color: 'var(--primary)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            id={`delete-project-${project.id}`}
            onClick={() => onDelete(project)}
            className="btn-icon"
            title="Delete project"
            style={{ color: 'var(--danger)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
