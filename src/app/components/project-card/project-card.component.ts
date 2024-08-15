import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {
  projects: Project[] = [];

  constructor (private projectService: ProjectService) {}

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    forkJoin([
      this.projectService.getProjects(),
      this.projectService.fetchProjects()
    ]).subscribe(([projects1, projects2]) => {
      this.projects = [...projects1, ...projects2];
    });
  }

  calculateTimeElapsed(date: string): void {
    const targetDate = moment(date);
    const now = moment();
    const duration = moment.duration(now.diff(targetDate));

    const years = Math.floor(duration.asYears());
    const months = Math.floor(duration.asMonths() % 12);
    const days = Math.floor(duration.asDays() % 30);

    let timeAgo = '';
    if (years > 0) {
      timeAgo += `${years} año${years > 1 ? 's' : ''} `;
    }
    if (months > 0) {
      timeAgo += `${months} mes${months > 1 ? 'es' : ''} `;
    }
    if (days > 0 || (years === 0 && months === 0)) {
      timeAgo += `${days} día${days > 1 ? 's' : ''}`;
    }

    timeAgo = `Hace ${timeAgo.trim()}`;
  }
}
