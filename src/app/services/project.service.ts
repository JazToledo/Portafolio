import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project';
import { Octokit } from '@octokit/rest';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'https://tiny-pavia-jaztoledo-560ef224.koyeb.app/api';

  private octokit = new Octokit();

  constructor(private http: HttpClient) { }

  // Github
  async fetchProjects(): Promise<Project[]> {
    const { data } = await this.octokit.repos.listForUser({ username: 'JazToledo' });

    const projects: Project[] = data.map(repo => ({
      _id: repo.id.toString(),
      name: repo.name,
      description: repo.description ? repo.description : '',
      url: repo.html_url,
      timeAgo: this.calculateTimeElapsed(repo.created_at || ''),
      startDate: repo.created_at ? new Date(repo.created_at) : undefined,
      endDate: repo.updated_at ? new Date(repo.updated_at) : undefined
    }));

    console.log(data[0])

    return projects;
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  calculateTimeElapsed(date: string | undefined): any {
    if (!date) return '';

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

    return `Hace ${timeAgo.trim()}`;
  }
}
