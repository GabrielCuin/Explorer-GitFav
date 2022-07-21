import { GithubUser } from "./githubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();

    GithubUser.search("GabrielCuin").then((user) => console.log(user));
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@gitFav:")) || [];
  }

  save() {
    localStorage.setItem("@gitFav:", JSON.stringify(this.entries));
  }

  async add(userName) {
    try {
      const userExists = this.entries.find((entry) => entry.login === userName);

      if (userExists) {
        throw new Error("Usuário já listado.");
      }

      const user = await GithubUser.search(userName);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");
    this.update();
    this.onAdd();
  }

  onAdd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value);
    };
  }

  update() {
    const div = document.querySelector(".no-list");

    this.removeAllTr();
    
    if (this.entries.length !== 0) {
      this.entries.forEach((user) => {
        const row = this.creatRow();
        
        row.querySelector(
          ".user img"
          ).src = `https://github.com/${user.login}.png`;
        row.querySelector(".user img").alt = `Image de ${user.name}`;
        row.querySelector(".user a").href = `https://github.com/${user.login}`;
        row.querySelector(".user p").textContent = user.name;
        row.querySelector(".user span").textContent = user.login;
        row.querySelector(".repositories").textContent = user.public_repos;
        row.querySelector(".followers").textContent = user.followers;
        
        row.querySelector(".remove").onclick = () => {
          const isOk = confirm("Tem certeza que deseja deletar essa linha?");
          if (isOk) {
            this.delete(user);
          }
        };
        
        div.classList.add('hide');
        this.tbody.append(row);
      });
    } else {
      div.classList.remove('hide');
    }
  }
  
  creatRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td class="user">
      <img
        src="https://github.com/GabrielCuin.png"
        alt="Imagem do git"
      />
      <a href="#" target="_blank">
        <p>Gabriel Cuin</p>
        <span>GabrielCuin</span></a
      >
    </td>
    <td class="repositories">42</td>
    <td class="followers">5</td>
    <td>
      <button class="remove">Remover</button>
    </td>
  `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
