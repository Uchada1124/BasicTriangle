import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import numpy as np
import itertools
import math

def main():
    # プレイヤー数と提携値の入力を受け取る
    v_1 = int(input("v_1の値を入力してください: "))
    v_2 = int(input("v_2の値を入力してください: "))
    v_3 = int(input("v_3の値を入力してください: "))
    v_12 = int(input("v_12の値を入力してください: "))
    v_13 = int(input("v_13の値を入力してください: "))
    v_23 = int(input("v_23の値を入力してください: "))
    v_123 = int(input("v_123の値を入力してください: "))
    v_n = v_123

    # mock
    # v_1, v_2, v_3 = 0, 0, 0
    # v_12, v_13, v_23 = 10, 0, 0
    # v_123 = 10
    # v_n = v_123

    # 基本三角形のプロット
    #plot_allocation_triangle(v_n=v_n, v_1=v_1, v_2=v_2, v_3=v_3, v_12=v_12, v_13=v_13, v_23=v_23, plane=True)
    #plot_allocation_triangle(v_n=v_n, v_1=v_1, v_2=v_2, v_3=v_3, v_12=v_12, v_13=v_13, v_23=v_23, plane=False)

    # シャープレイ値の計算
    players = {1, 2, 3}
    shapley_values = calculate_shapley_value(players, v_1, v_2, v_3, v_12, v_13, v_23, v_123)
    print("シャープレイ値:", shapley_values)

    plot_allocation_triangle(v_n=v_n, v_1=v_1, v_2=v_2, v_3=v_3, v_12=v_12, v_13=v_13, v_23=v_23, plane=False, shapley=True)

def plot_allocation_triangle(v_n, v_1=None, v_2=None, v_3=None, v_12=None, v_13=None, v_23=None, plane=True, shapley=False):
    # 頂点の座標
    vertices = np.array([
        [v_n, 0, 0],
        [0, v_n, 0],
        [0, 0, v_n]
    ])
    
    # 図の作成
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')
    
    # 全体提携値の三角形の面を描画
    tri = Poly3DCollection([vertices], color='skyblue', alpha=0.6)
    ax.add_collection3d(tri)
    
    # 各プレイヤーの提携値を表示する面を追加
    # 領域全体を切断するために3D空間を横切る面を作成
    
    # v_1 に対する面
    if v_1 is not None:
        plane_vertices_1 = np.array([
            [v_1, 0, 0],
            [v_1, v_n, 0],
            [v_1, 0, v_n],
            [v_1, v_n, v_n]
        ])
        if(plane):
            plane_1 = Poly3DCollection([plane_vertices_1[:3], plane_vertices_1[1:]], color='lightgreen', alpha=0.5)
            ax.add_collection3d(plane_1)

        #v_1と接する線
        point1 = [v_1, 0, v_n - v_1]
        point2 = [v_1, v_n - v_1, 0]
        ax.scatter(*point1, color='green', s=30)
        ax.scatter(*point2, color='green', s=30)
        ax.plot([point1[0], point2[0]], [point1[1], point2[1]], [point1[2], point2[2]], color='green')
    
    # v_2 に対する面
    if v_2 is not None:
        plane_vertices_2 = np.array([
            [0, v_2, 0],
            [v_n, v_2, 0],
            [0, v_2, v_n],
            [v_n, v_2, v_n]
        ])
        if(plane):
            plane_2 = Poly3DCollection([plane_vertices_2[:3], plane_vertices_2[1:]], color='lightcoral', alpha=0.5)
            ax.add_collection3d(plane_2)

        #v_2と接する線
        point3 = [0, v_2, v_n - v_2]
        point4 = [v_n - v_2, v_2, 0]
        ax.scatter(*point3, color='red', s=30)
        ax.scatter(*point4, color='red', s=30)
        ax.plot([point3[0], point4[0]], [point3[1], point4[1]], [point3[2], point4[2]], color='red')
    
    # v_3 に対する面
    if v_3 is not None:
        plane_vertices_3 = np.array([
            [0, 0, v_3],
            [v_n, 0, v_3],
            [0, v_n, v_3],
            [v_n, v_n, v_3]
        ])
        if(plane):
            plane_3 = Poly3DCollection([plane_vertices_3[:3], plane_vertices_3[1:]], color='lightblue', alpha=0.5)
            ax.add_collection3d(plane_3)

        #v_3と接する線
        point5 = [v_n - v_3, 0, v_3]
        point6 = [0, v_n - v_3, v_3]
        ax.scatter(*point5, color='blue', s=30)
        ax.scatter(*point6, color='blue', s=30)
        ax.plot([point5[0], point6[0]], [point5[1], point6[1]], [point5[2], point6[2]], color='blue')
    
    # x + y = v_12 に対する面
    if v_12 is not None:
        plane_vertices_12 = np.array([
            [v_12, 0, 0],
            [0, v_12, 0],
            [v_12, 0, v_n],
            [0, v_12, v_n]
        ])
        if plane:
            plane_12 = Poly3DCollection([plane_vertices_12[:3], plane_vertices_12[1:]], color='lightyellow', alpha=0.5)
            ax.add_collection3d(plane_12)

        # x + y = v_12 平面と接する線
        intersection_point_1 = [0, v_12, v_n - v_12]
        intersection_point_2 = [v_12, 0, v_n - v_12]
        ax.scatter(*intersection_point_1, color='yellow', s=30)
        ax.scatter(*intersection_point_2, color='yellow', s=30)
        ax.plot([intersection_point_1[0], intersection_point_2[0]], 
                [intersection_point_1[1], intersection_point_2[1]], 
                [intersection_point_1[2], intersection_point_2[2]], color='yellow')

    # x + z = v_13 に対する面
    if v_13 is not None:
        plane_vertices_13 = np.array([
            [v_13, 0, 0],
            [0, 0, v_13],
            [v_13, v_n, 0],
            [0, v_n, v_13]
        ])
        if plane:
            plane_13 = Poly3DCollection([plane_vertices_13[:3], plane_vertices_13[1:]], color='lightpink', alpha=0.5)
            ax.add_collection3d(plane_13)

        # x + z = v_13 平面と接する線
        intersection_point_3 = [v_13, v_n - v_13 , 0]
        intersection_point_4 = [0, v_n - v_13, v_13]
        ax.scatter(*intersection_point_3, color='pink', s=30)
        ax.scatter(*intersection_point_4, color='pink', s=30)
        ax.plot([intersection_point_3[0], intersection_point_4[0]], 
                [intersection_point_3[1], intersection_point_4[1]], 
                [intersection_point_3[2], intersection_point_4[2]], color='pink')
    
    # y + z = v_23 に対する面
    if v_23 is not None:
        plane_vertices_23 = np.array([
            [0, v_23, 0],
            [0, 0, v_23],
            [v_n, v_23, 0],
            [v_n, 0, v_23]
        ])
        if plane:
            plane_23 = Poly3DCollection([plane_vertices_23[:3], plane_vertices_23[1:]], color='lightsalmon', alpha=0.5)
            ax.add_collection3d(plane_23)

        # y + z = v_23 平面と接する線
        intersection_point_5 = [v_n - v_23, v_23, 0]
        intersection_point_6 = [v_n - v_23, 0, v_23]
        ax.scatter(*intersection_point_5, color='salmon', s=30)
        ax.scatter(*intersection_point_6, color='salmon', s=30)
        ax.plot([intersection_point_5[0], intersection_point_6[0]], 
                [intersection_point_5[1], intersection_point_6[1]], 
                [intersection_point_5[2], intersection_point_6[2]], color='salmon')
        
    if shapley:
        players = {1, 2, 3}
        shapley_values = calculate_shapley_value(players, v_1, v_2, v_3, v_12, v_13, v_23, v_n)
        # シャープレイ値を座標に変換
        shapley_coordinates = (shapley_values[1], shapley_values[2], shapley_values[3])
        ax.scatter(*shapley_coordinates, color='black', s=50, label='Shapley Value')
        ax.text(shapley_coordinates[0], shapley_coordinates[1], shapley_coordinates[2], 'Shapley', color='black')


    # 各軸の範囲設定
    ax.set_xlim(0, v_n)
    ax.set_ylim(0, v_n)
    ax.set_zlim(0, v_n)
    
    # 軸ラベル
    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')
    
    # マウス操作で視点変更可能にする
    ax.view_init(elev=20., azim=30)
    
    plt.show()

def calculate_shapley_value(players, v_1, v_2, v_3, v_12, v_13, v_23, v_123):
    # 参考：https://qiita.com/leisurely/items/4cb3fb64e487dba61b15

    # 提携値の辞書を作成
    coalition_values = {
        frozenset(): 0,
        frozenset([1]): v_1,
        frozenset([2]): v_2,
        frozenset([3]): v_3,
        frozenset([1, 2]): v_12,
        frozenset([1, 3]): v_13,
        frozenset([2, 3]): v_23,
        frozenset([1, 2, 3]): v_123
    }

    # 階乗の計算
    def factorial(n):
        return math.factorial(n)
    
    # すべての部分集合を生成
    def power_set(s):
        return list(itertools.chain.from_iterable(itertools.combinations(s, r) for r in range(len(s)+1)))

    # シャープレイ値の初期化
    shapley_values = {player: 0 for player in players}

    for player in players:
        for coalition in power_set(players - {player}):
            coalition = frozenset(coalition)
            marginal_contribution = (coalition_values[coalition | {player}] - coalition_values[coalition])
            weight = factorial(len(coalition)) * factorial(len(players) - len(coalition) - 1) / factorial(len(players))
            shapley_values[player] += weight * marginal_contribution

    return shapley_values

if __name__ == '__main__':
    main()