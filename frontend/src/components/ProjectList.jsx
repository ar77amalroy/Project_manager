'use client';

import ProjectCard from './ProjectCard';

const ProjectList = ({ projects, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="skeleton h-5 w-3/4 mb-2" />
                <div className="skeleton h-3 w-1/3" />
              </div>
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-5/6" />
              <div className="skeleton h-3 w-2/3" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}>
              <div className="skeleton h-3 w-24" />
              <div className="flex gap-2">
                <div className="skeleton h-8 w-8 rounded-lg" />
                <div className="skeleton h-8 w-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: 'rgba(8, 145, 178, 0.08)' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: 'var(--text-muted)' }}>
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>No projects found</h3>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Create your first project to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project, index) => (
        <div
          key={project.id}
          style={{ animation: `fadeIn 0.5s ease-out ${index * 0.06}s both` }}
        >
          <ProjectCard
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
