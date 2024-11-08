const hoje = new Date();
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
    const infoVendas = document.querySelector(".info__vendas__desktop");
    const vendasMes = document.querySelector(".vendasMes");

    if (meta === 0) {
        infoMeta.style.display = "block";
        infoVendas.style.display = "none";
        vendasMes.style.display = "none";
    } else {
        infoMeta.style.display = "none";
        infoVendas.style.display = "flex";
        infoVendas.style.marginTop = "-15px";
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
        acumulador + parseFloat(valorAtual.valor), 0);

    totalVendasHoje = vendasDeHoje.reduce((acumulador, valorAtual) =>
        acumulador + parseFloat(valorAtual.valor), 0);

}

function renderInfo() {
    const elementoInfoMes = document.querySelector(".infoMes__porcentagem");
    const elementoTotalHoje = document.querySelector(".vendasMes__totaldoDia");

    elementoInfoMes.innerHTML = `Você vendeu ${paraMoeda(totalVendasMes)}
 de sua meta de R$ ${paraMoeda(meta)} (${((totalVendasMes / meta) * 100).toFixed(1)}%)`;

    elementoTotalHoje.innerHTML = `Total de Hoje: ${paraMoeda(parseFloat(totalVendasHoje))}`
};


function inserirNovaVenda() {

    let dataVenda = hoje.getDate();;
    let valor;

    const elementoValor = document.querySelector("#valor");

    if (elementoValor.value === "" || elementoValor.value <= 0) {
        alert("Insira um valor de venda válido!");
        return;
    } else {
        valor = elementoValor.value;
        elementoValor.value = "";
    };

    let novaVenda;

    if (vendas.length === 0) {
        novaVenda = new Venda(dataVenda, valor, vendas.length + 1);
    } else {
        const ultVenda = vendas[0];
        console.log(ultVenda)
        novaVenda = new Venda(dataVenda, valor, ultVenda.id + 1);
    }

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

    const vendas20 = vendasOrdenadas.slice(0, 20);

    vendas20.forEach(elemento => {
        tabelaCorpo.innerHTML += `
        <tr>
        <td class="vendasMes__tabela__td">${elemento.dia}</td>
        <td class="vendasMes__tabela__td">${paraMoeda(parseFloat(elemento.valor))}</td>
        <td class="vendasMes__tabela__td"><i class="fa-regular fa-trash-can iconeTrash" style="color: #000000;" onClick="removerVenda(${elemento.id}, ${elemento.valor})"></i></td>
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

function verificarMetaBatida() {
    if (totalVendasMes >= meta) {
        alert("Parabéns, você bateu a meta!");
    }
};

function removerVenda(id, valor) {
    const confirmacao = window.confirm(`Deseja apagar a venda de ${paraMoeda(valor)}?`);
    if (confirmacao) {
        let i = 0;
        for (venda of vendas) {
            if (venda.id == id) {
                vendas.splice(i, 1);
                localStorage.setItem("vendas", JSON.stringify(vendas));
                atualizarVendas();
                renderInfo();
                renderTabela();
            }
            i += 1;
        }
    } else {
        return;
    }
}

NovoMês();
renderTabela();
renderInfo();
