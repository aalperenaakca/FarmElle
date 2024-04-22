

export function multiDimensionalKnapsack(values, weights, capacities) {
    let n = values.length;
    let dp = Array.from({ length: n + 1 }, () =>
        Array.from({ length: capacities[0] + 1 }, () =>
            Array.from({ length: capacities[1] + 1 }, () =>
                Array(capacities[2] + 1).fill(0))));
    
    // Hangi öğelerin seçildiğini takip etmek için kullanılacak
    let selected = Array.from({ length: n + 1 }, () =>
        Array.from({ length: capacities[0] + 1 }, () =>
            Array.from({ length: capacities[1] + 1 }, () =>
                Array(capacities[2] + 1).fill(false))));

    for (let i = 1; i <= n; i++) {
        for (let w1 = 0; w1 <= capacities[0]; w1++) {
            for (let w2 = 0; w2 <= capacities[1]; w2++) {
                for (let w3 = 0; w3 <= capacities[2]; w3++) {
                    if (weights[i - 1][0] <= w1 && weights[i - 1][1] <= w2 && weights[i - 1][2] <= w3) {
                        let val = values[i - 1] + dp[i - 1][w1 - weights[i - 1][0]][w2 - weights[i - 1][1]][w3 - weights[i - 1][2]];
                        if (val > dp[i - 1][w1][w2][w3]) {
                            dp[i][w1][w2][w3] = val;
                            selected[i][w1][w2][w3] = true;
                        } else {
                            dp[i][w1][w2][w3] = dp[i - 1][w1][w2][w3];
                        }
                    } else {
                        dp[i][w1][w2][w3] = dp[i - 1][w1][w2][w3];
                    }
                }
            }
        }
    }

    // Seçilen bitkilerin listesini oluşturma
    let i = n, w1 = capacities[0], w2 = capacities[1], w3 = capacities[2];
    let selectedItems = [];
    while (i > 0) {
        if (selected[i][w1][w2][w3]) {
            selectedItems.push(i - 1); // Bitki indeksi
            w1 -= weights[i - 1][0];
            w2 -= weights[i - 1][1];
            w3 -= weights[i - 1][2];
        }
        i--;
    }

    return { maxValue: dp[n][capacities[0]][capacities[1]][capacities[2]], selectedItems };
}



