export interface GithubRepo {
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  image?: string;
  topics?: string[];
  homepage?: string;
  languages?: string[]; // ✅ nouveaux langages principaux
}

export async function getGithubProjects(username: string): Promise<GithubRepo[]> {
  const repoRes = await fetch(`https://api.github.com/users/${username}/repos`);
  if (!repoRes.ok) throw new Error('Erreur de récupération des dépôts GitHub');

  const repos = await repoRes.json();

  const enriched = await Promise.all(
    repos
      .filter((r: any) => !r.fork)
      .map(async (repo: any) => {
        let image: string | undefined;
        let topics: string[] = [];
        let languages: string[] = [];

        try {
          // 🔹 1. Récupération des topics (tags GitHub)
          const topicsRes = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/topics`,
            { headers: { Accept: 'application/vnd.github.mercy-preview+json' } }
          );
          if (topicsRes.ok) {
            const topicData = await topicsRes.json();
            topics = topicData.names || [];
          }

          // 🔹 2. Récupération des langages
          const langRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`);
          if (langRes.ok) {
            const langData = await langRes.json();
            languages = Object.keys(langData); // On garde juste les noms
          }

          // 🔹 3. Lecture du README brut (pour extraire une image)
          const readmeRes = await fetch(
            `https://raw.githubusercontent.com/${username}/${repo.name}/HEAD/README.md`
          );
          if (readmeRes.ok) {
            const readmeText = await readmeRes.text();
            const match = readmeText.match(/!\[.*?\]\((.*?)\)/);
            if (match && match[1]) {
              let url = match[1];
              if (!url.startsWith('http')) {
                url = `https://raw.githubusercontent.com/${username}/${repo.name}/HEAD/${url}`;
              }
              image = url;
            }
          }
        } catch (err) {
          console.warn(`Erreur enrichissement ${repo.name}:`, err);
        }

        return {
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          homepage: repo.homepage || undefined,
          image,
          topics,
          languages,
        };
      })
  );

  return enriched.sort((a, b) => b.stargazers_count - a.stargazers_count);
}
