const hoje = new Date();
console.log(hoje.getDate())
const elementoData = document.querySelector("#dataDoDia");
elementoData.innerHTML = hoje.toLocaleDateString("pt-br", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
});

let meta = parseFloat(JSON.parse(localStorage.getItem("meta"))) || 0;

function atribuirMeta() {
    const inputMeta = document.querySelector(".infoMeta__meta");
    if (inputMeta.value === "") {
        alert("Digite uma meta para continuar!");
    } else {
        localStorage.setItem("meta", JSON.stringify(inputMeta.value));
        meta = inputMeta.value;
        location.reload();
    }

    inputMeta.value = "";
}

const elementoNovaMeta = document.querySelector(".infoMeta__form__botao");
elementoNovaMeta.addEventListener("click", (event) => {
    event.preventDefault();
    atribuirMeta();
})

function NovoMês() {
    const infoMeta = document.querySelector(".infoMeta");
    const infoMes = document.querySelector(".infoMes");
    const novaVenda = document.querySelector(".novaVenda");
    const vendasMes = document.querySelector(".vendasMes");

    if (meta === 0) {
        infoMeta.style.display = "block";
        infoMes.style.display = "none";
        novaVenda.style.display = "none";
        vendasMes.style.display = "none";
    } else {
        infoMeta.style.display = "none";
        infoMes.style.display = "block";
        infoMes.style.marginTop = "-15px";
        novaVenda.style.display = "block";
        vendasMes.style.display = "block";
    }
}

class Venda {
    constructor(dia, valor, id) {
        this.dia = dia;
        this.valor = valor;
        this.id = id;
    }
}

const vendas = JSON.parse(localStorage.getItem("vendas")) || [];

let totalVendasMes;
let totalVendasHoje;
let vendasDeHoje = vendas.filter(venda => venda.dia == hoje.getDate());
atualizarVendas();

function atualizarVendas() {
    vendasDeHoje = vendas.filter(venda => venda.dia == hoje.getDate());

    totalVendasMes = vendas.reduce((acumulador, valorAtual) =>
        acumulador + parseFloat(valorAtual.valor),0);

    totalVendasHoje = vendasDeHoje.reduce((acumulador, valorAtual) =>
        acumulador + parseFloat(valorAtual.valor),0);

}

function renderInfo() {
    const elementoInfoMes = document.querySelector(".infoMes__porcentagem");
    const elementoTotalHoje = document.querySelector(".vendasMes__totaldoDia");

    elementoInfoMes.innerHTML = `Você vendeu ${paraMoeda(totalVendasMes)}
 de sua meta de R$ ${paraMoeda(meta)} (${((totalVendasMes / meta) * 100).toFixed(1)}%)`;

    elementoTotalHoje.innerHTML = `Total de Hoje: ${paraMoeda(parseFloat(totalVendasHoje))}`
};


function inserirNovaVenda() {

    let dataVenda  = hoje.getDate();;
    let valor;

    const elementoValor = document.querySelector("#valor");

    if (elementoValor.value === "") {
        alert("Insira um valor de venda!");
        return;
    } else {
        valor = elementoValor.value;
        elementoValor.value = "";
    };

    const novaVenda = new Venda(dataVenda, valor, vendas.length + 1);
    vendas.push(novaVenda);
    localStorage.setItem("vendas", JSON.stringify(vendas));
    atualizarVendas();
    renderInfo();
    renderTabela();
    verificarMetaBatida();
};

const elementoNovaVenda = document.querySelector(".novaVenda__form__botao");
elementoNovaVenda.addEventListener("click", (evento) => {
    evento.preventDefault();
    inserirNovaVenda();
});

function renderTabela() {

    const tabelaCorpo = document.getElementById("tabela-corpo");
    tabelaCorpo.innerHTML = "";

    const vendasOrdenadas = vendas.sort((a, b) => b.id - a.id);
    console.log(vendasOrdenadas)

    const vendas20 = vendasOrdenadas.slice(0, 20);

    vendas20.forEach(elemento => {
        tabelaCorpo.innerHTML += `
        <tr>
        <td class="vendasMes__tabela__td">${elemento.dia}</td>
        <td class="vendasMes__tabela__td">${paraMoeda(parseFloat(elemento.valor))}</td>
    </tr>
        `
    });
}

function paraMoeda(valor) {
    return valor.toLocaleString("pt-br", { currency: "BRL", style: "currency" });
}


/*-------------------------------*/

const eZerar = document.querySelector(".vendasMes__zerar");
eZerar.addEventListener("click", (evento) => {
    evento.preventDefault();
    const confirmacao = window.confirm("Deseja iniciar novo mês?");
    if (confirmacao) {
        zerarMes();
    } else {
        return;
    }
    location.reload();
})

function zerarMes() {
    localStorage.clear();
};

function verificarMetaBatida(){
    if(totalVendasMes >= meta){
        alert("Parabéns, você bateu a meta!");
    }
};

NovoMês();
renderTabela();
renderInfo();
