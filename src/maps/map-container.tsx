import React, { useEffect, useRef } from 'react';
import styles from './map-container.module.css';
import AMapLoader from '@amap/amap-jsapi-loader';
import "../components/map-icon.css"

const MapContainer: React.FC = () => {
	const mapRef = useRef(null);

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
				// Initialize map
				const map = new AMap.Map("container", {
					viewMode: "3D",
					zoom: 17,
					center: [116.345983, 40.003175],
					pitch: 30,
					rotation: -15,
					showBuildingBlock: false,
					layers: [satellite, roadNet, buildings],
					mapStyle: 'amap://styles/light',
					immediately: false,
				});
				mapRef.current = map;

				// 异步加载插件
				AMap.plugin([
					"AMap.ToolBar",
					"AMap.ControlBar",
					"AMap.Geolocation",
					"AMap.AutoComplete",
					'AMap.Driving',
					'AMap.Polyline',
				], () => {

					map.on('complete', function completeFC() {

						// 3D罗盘
						const controlBar = new AMap.ControlBar({
							position: { top: "2vh", right: "1vw" }
						});
						map.addControl(controlBar);

						// Marker
						const marker = new AMap.Marker({
							position: new AMap.LngLat(116.345983, 40.003175),
							title: '林大',
							content: '' +'<div class="loader-shape-3"></div>',
							// offset: new AMap.Pixel(-13, -30)/,
							zooms:[15,20],
							anchor:"bottom-center",
						});
						map.add(marker);
						const clickHandlerPosition = (e: { lnglat: { getLng: () => number; getLat: () => number; }; }) => {
							console.log([e.lnglat.getLng(), e.lnglat.getLat()])
						};
						
						map.on('click', clickHandlerPosition);
						map.setFitView();
					})

				})

				map.add(traffic);

				return () => {
					map?.destroy();
				};
			} catch (error) {
				console.error(error)
			}
		};

		loadMap();

	}, [mapRef]);

	return (
		<div
			id="container"
			className={styles.container}
		/>

	);
}


export default MapContainer;