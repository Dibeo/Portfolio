import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getGithubProjects, GithubRepo } from '../utils/github-api';
import { Bio } from "../bio/bio";

@Component({
  selector: 'app-projets',
  imports: [CommonModule, Bio],
  templateUrl: './projets.html',
  styleUrl: './projets.css'
})
export class Projets implements OnInit {
  projects: GithubRepo[] = [];
  isLoading = true;

  async ngOnInit() {
    try {
      this.projects = await getGithubProjects('dibeo');
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  }
}
