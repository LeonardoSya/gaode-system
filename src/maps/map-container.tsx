import { useEffect } from 'react';
import styles from './map-container.module.css';
import AMapLoader from '@amap/amap-jsapi-loader';

const MapContainer = () => {

	useEffect(() => {

		const loadMap = async () => {
			try {
				const AMap = await AMapLoader.load({
					key: "633247c700bba002d0d368183bd67b98",
					version: '2.0',
				});

				// 路况图层
				const traffic = new AMap.TileLayer.Traffic({
					autoRefresh: true,
					interval: 180,
					opacity: 0.6
				})
				// 卫星与路网图层
				const satellite = new AMap.TileLayer.Satellite();
				const roadNet = new AMap.TileLayer.RoadNet({
					opacity: 0.7
				});
				// 楼块图层
				const buildings = new AMap.Buildings({
					zooms: [17, 20],
					zIndex: 10,
					heightFactor: 2,
				});

				const map = new AMap.Map("container", {
					viewMode: "3D",
					zoom: 17,
					center: [116.4, 39.9],
					pitch: 30,
					rotation: -15,
					showBuildingBlock: false,
					layers: [satellite, roadNet, buildings],
				});

				// 异步加载插件
				AMap.plugin([
					"AMap.ToolBar",
					"AMap.ControlBar",
					"AMap.Geolocation",
					"AMap.AutoComplete",
					'AMap.Driving',
					'AMap.Polyline',
				], function () {
					// 3D罗盘
					// const controlBar = new AMap.ControlBar({
					// 	position: { top: "2vh", right: "1vw" }
					// });
					// 输入提示插件
					// const autoOptions = { city: "全国", input: "map-search", };
					// const autoComplete = new AMap.Autocomplete(autoOptions);
					// 定位

					// map.addControl(controlBar);

				})

				map.setMapStyle('amap://styles/light')
				map.add(traffic);

				return () => map?.destroy();

			} catch (error) {
				console.log(error)
			}
		};

		loadMap();

	}, []);

	return (
		<div
			id="container"
			className={styles.container}
		/>

	);
}


export default MapContainer;