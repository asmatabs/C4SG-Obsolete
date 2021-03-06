import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Project} from '../common/project';
import {ProjectService} from '../common/project.service';

@Component({
  selector: 'my-projects',
  templateUrl: 'project-list.component.html',
  styleUrls: ['project-list.component.css']
})

export class ProjectListComponent implements OnInit {

  projects: Project[];
  selectedProject: Project;

  constructor(private projectService: ProjectService, private router: Router) {
  }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.projectService.getProjects().subscribe(
      res => this.projects = res.json(),
      error => console.log(error)
    )
  }

  getProjectsByKeyword(keyword: string) {
    keyword = keyword.trim();
    if (!keyword) {
      return;
    }

    this.projectService.getProjectsByKeyword(keyword).subscribe(
      res => {
        // this.projects = res.json()
        this.projects = res.json().map(project => ({
          description: project.description,
          image: project.image,
          name: project.name,
          organizationName: project.organization.name,
        }));

      },
      error => console.log(error)
    );
  }

  onSelect(project: Project): void {
    this.selectedProject = project;
    this.router.navigate(['/project/view', project.id]);
  }

  // TODO Don't provide the identity colume value
  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }

    let project = new Project(8, name, 1, 'description', 'logo.png', 'city', 'USA', '55311', 'Teens Give');

    this.projectService
      .add(project)
      .subscribe(
        response => {
          this.getProjects();
          this.router.navigate(['/nonprofits']);
        },
        error => console.log(error)
      );
  }

  delete(project: Project): void {
    this.projectService
      .delete(project.id)
      .subscribe(
        response => { // An error occurred SyntaxError: Unexpected end of JSON input
          this.getProjects();
          this.router.navigate(['/nonprofits']);
        },
        error => console.log(error)
      );
  }
}
