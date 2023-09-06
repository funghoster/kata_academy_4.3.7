// Model
class GetResult {
    constructor(targetValue) {
        this.link = `https://api.github.com/search/repositories?q=${targetValue}`
    }

    async getRepo() {
        return fetch(this.link)
            .then(response => response.json())
            .then(repo => repo)
            .catch(err => console.log(err))
    }

}

const debounce = (fn, debounceTime) => {
	let timeout
    return function() {
    	const fnApply = () => fn.apply(this, arguments)
    	clearTimeout(timeout)
    	timeout = setTimeout(fnApply, debounceTime);
    }
};

function createFindElement(textContent) {
    const createElementFindRepo = document.createElement('span')
    createElementFindRepo.textContent = textContent
    return createElementFindRepo
}

function closedFindRepo() {
    document.querySelector('.search__result').replaceChildren()
}

function deleteBtn(e) {
    e.target.parentNode.remove()
}

// View

function createFindContainer(repoList, num = 5) {
    const spanContainer = document.querySelector('.search__result')
    if (spanContainer.hasChildNodes()) closedFindRepo()
    
    const fragment = document.createDocumentFragment();
    let spanElement
    if (repoList.length === 0) {
        spanElement = createFindElement("Нет результатов")
        fragment.appendChild(spanElement)
    } else {
        let i = 0;
        while (i < num) {
            spanElement = createFindElement(repoList[i].name)
            spanElement.addEventListener('click', () => {
                document.querySelector('.search').value = ''
                createCardRepo(repoList[i])
            })
            fragment.appendChild(spanElement)
            i++
        }
    }
    spanContainer.appendChild(fragment)
}

function createCardRepo(repo) {
    const fragment = document.createDocumentFragment();
    const cardBody = document.createElement('div')
    cardBody.classList.add('search__list-elements')
    const cardInfo = document.createElement('div')
    cardInfo.classList.add('search__info')
    const cardName = document.createElement('div')
    cardName.classList.add('search__name')
    cardName.textContent = `Name: ${repo.name}`
    const cardOwner = document.createElement('div')
    cardOwner.classList.add('search__owner')
    cardOwner.textContent = `Owner: ${repo.owner.login}`
    const cardStars = document.createElement('div')
    cardStars.classList.add('search__stars')
    cardStars.textContent = `Stars: ${repo.stargazers_count}`
    cardInfo.appendChild(cardName)
    cardInfo.appendChild(cardOwner)
    cardInfo.appendChild(cardStars)
    const cardBtn = document.createElement('button')
    cardBtn.classList.add('search__element-delete-btn')
    cardBtn.addEventListener('click', e => deleteBtn(e))
    cardBody.appendChild(cardInfo)
    cardBody.appendChild(cardBtn)
    fragment.appendChild(cardBody)
    document.querySelector('.search__list').appendChild(fragment)

    closedFindRepo()
}





// Controller

function onChange(e) {
    if (e.target.value !== '') {
        const repo = new GetResult(e.target.value)
        repo.getRepo().then(res => {
            if (res.items.length < 5) {
                createFindContainer(res.items, res.items.length)
            } else {
                createFindContainer(res.items, 5)
            }
        })
    } else closedFindRepo()
}

onChange = debounce(onChange, 300)

document.querySelector('.search').addEventListener('keyup', onChange)

document.addEventListener('click', e => {
    const anotherElem = document.querySelector('.search__result')
    const searchElem = document.querySelector('.search')
    if (e.target !== anotherElem) closedFindRepo()
    if (e.target === searchElem) onChange(e)
  })