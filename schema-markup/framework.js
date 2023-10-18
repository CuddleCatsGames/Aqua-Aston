// generative @id function
function id(type, identifier) {
	// The goal of this is to generate a unique id for each schema.org object (usable in the '@id' key)
	// Might there be a 'type' AND a 'identifier' that reference different objects but generate the same id?
	// maybe we can add 1 more 'key' that is used as a secondary reference value for the object? ex: 'document' (for a pdf a CreativeWork)... this is just an idea

	// 'type' is the type of schema.org object ex: 'Organization', 'WebSite', 'ImageObject', etc.
	// 'identifier' is a primary referencing value for the object. This might be a 'title', a 'identifier', 'caption', etc.

	// Ensure identifier is a string, if not, convert it to a string

	if (typeof identifier !== 'string') {identifier = String(identifier)}
	if (!identifier) {
		identifier = 'PLACEHOLDER'
		console.log('identifier is empty, using placeholder')
	}
	function concatenateWithCamelCase(identifier) {
		identifier = identifier.split(' '); // Split the identifier into an array of words
		return identifier.map((word, index) => { // Convert the array of words into camelCase format
			const lowerCasedWord = word.toLowerCase(); // Ensure each word is in lowercase
			return index === 0 ? lowerCasedWord : lowerCasedWord.charAt(0).toUpperCase() + lowerCasedWord.slice(1); // Capitalize the first letter of each word (except the first one)
		}).join('');
	}
	const identifierCamelCase = concatenateWithCamelCase(identifier);
	const base = hotel.homepage;
	return `${base}#${type}-${identifierCamelCase}`;
}

// generative JSON function
function serpHotelPack(hotel) {

	// hotel variables
	const hotelType = hotel.type || 'Hotel';
	const hotelId = id(hotelType, hotel.name);

	// hotel amenities array
	let amenities = [];
	if (hotel.amenitiesArr.length > 0) {
		hotel.amenitiesArr.forEach(function (amenity) {

			let amenityImage = [];
			if (amenity.imageUrl) {
				amenityImage = {
					'@type': 'ImageObject', // https://schema.org/ImageObject
					'@id': id('ImageObject', amenity.name),
					'url': amenity.imageUrl,
					'name': amenity.name,
					'contentUrl': amenity.imageUrl,
					'caption': amenity.name,
					'license': hotel.copyrightUrl || hotel.url,
					'acquireLicensePage': hotel.copyrightUrl || hotel.url,
					'creditText': hotel.name,
					'creator': {
						'@type': 'Organization', // https://schema.org/Organization
						'@id': hotelId,
					},
					'copyrightNotice': 'All right reserved',
				}
			}

			if (amenity.name) {
				amenities.push({
					'@type': 'LocationFeatureSpecification', // https://schema.org/LocationFeatureSpecification
					'@id': id('LocationFeatureSpecification', amenity.name),
					'url': amenity.url,
					'name': amenity.name,
					'value': true,
					'image': amenityImage,
				});
			}

		});
	}

	// hotel room group array
	let roomGroups = [];
	if (hotel.roomGroupsArr.length === 0) {
		hotel.roomGroupsArr.forEach(function (room) {
			roomGroups.push({
				'@type': 'QuantitativeValue', // https://schema.org/QuantitativeValue
				'@id': id('QuantitativeValue', room.numberOfRooms + '-' + room.roomType),
				'unitText': room.roomType,
				'value': room.numberOfRooms,
			})
		});
	}

	// hotel images array
	let images = [];
	if (hotel.imageArr.length > 0) {
		hotel.imageArr.forEach(function (image) {

			// if image has a url
			if (image.url) {
				images.push({
					'@type': 'ImageObject', // https://schema.org/ImageObject
					'@id': id('ImageObject', image.caption + '-' + image.url),
					'url': image.url,
					'name': image.caption,
					'contentUrl': image.url,
					'caption': image.caption,
					'license': hotel.copyrightUrl || hotel.url,
					'acquireLicensePage': hotel.copyrightUrl || hotel.url,
					'creditText': hotel.name,
					'creator': {
						'@type': 'Organization', // https://schema.org/Organization
						'@id': hotelId,
					},
					'copyrightNotice': 'All right reserved',
				})
			}
		});
	}

	// hotel rooms array
	let rooms = [];
	if (hotel.roomsArr.length > 0) {
		hotel.roomsArr.forEach(function (room) {

			// set room variables
			const capturedRoomType = room.type || 'HotelRoom';
			const roomId = id(capturedRoomType, room.name);
			const effectiveRoomType = [capturedRoomType, 'Product'];
			const petsBoolean = room.petsAllowedTrueOrFalse || hotel.petsAllowedTrueFalse;

			// room amenities array
			let roomAmenities = [];
			if (room.roomAmenitiesArr) {
				room.roomAmenitiesArr.forEach(function (roomAmenity) {

					let roomAmenityImage = [];
					if (roomAmenity.imageUrl) {
						roomAmenityImage = {
							'@type': 'ImageObject', // https://schema.org/ImageObject
							'@id': id('ImageObject', roomAmenity.name + '-' + roomAmenity.imageUrl),
							'url': roomAmenity.imageUrl,
							'name': roomAmenity.name,
							'contentUrl': roomAmenity.imageUrl,
							'caption': roomAmenity.name,
							'license': hotel.copyrightUrl || hotel.url,
							'acquireLicensePage': hotel.copyrightUrl || hotel.url,
							'creditText': hotel.name,
							'creator': {
								'@type': 'Organization', // https://schema.org/Organization
								'@id': hotelId,
							},
							'copyrightNotice': 'All right reserved',
						}
					}

					if (roomAmenity.name) {
						roomAmenities.push({
							'@type': 'LocationFeatureSpecification', // https://schema.org/LocationFeatureSpecification
							'@id': id('LocationFeatureSpecification', roomAmenity.name),
							'url': roomAmenity.url,
							'name': roomAmenity.name,
							'value': true,
							'image': roomAmenityImage,
						});
					}
				});
			}

			// room images array
			let roomImages = [];
			if (room.images.length > 0) {
				room.images.forEach(function (image) {

					// if image has a url
					if (image.url) {
						roomImages.push({
							'@type': 'ImageObject', // https://schema.org/ImageObject
							'@id': id('ImageObject', image.caption + '-' + image.url),
							'url': image.url,
							'name': image.caption,
							'contentUrl': image.url,
							'caption': image.caption,
							'license': hotel.copyrightUrl || room.url || hotel.url,
							'acquireLicensePage': hotel.copyrightUrl || room.url || hotel.url,
							'creditText': hotel.name,
							'creator': {
								'@type': 'Organization', // https://schema.org/Organization
								'@id': hotelId,
							},
							'copyrightNotice': 'All right reserved',
						});
					}
				});
			}

			// push each room
			rooms.push({
				'@type': effectiveRoomType, // https://schema.org/HotelRoom + https://schema.org/Product
				'@id': roomId,
				'amenityFeature': roomAmenities,
				'containedInPlace': {"@id": hotelId},
				'url': room.url,
				'name': room.name,
				'aggregateRating': {'@id': id('AggregateRating', hotel.name)},
				'brand': {'@id': id('Brand', hotel.name)},
				'offers': {
					'@type': 'Offer', // https://schema.org/Offer
					'@id': id('Offer', room.name + '_offer'),
					'businessFunction': 'http://purl.org/goodrelations/v1#LeaseOut',
					'availability': 'https://schema.org/InStock', // auditable
					'priceValidUntil': new Date().toISOString().split('T')[0], // auditable
					'hasMerchantReturnPolicy': {
						'@type': 'MerchantReturnPolicy', // https://schema.org/MerchantReturnPolicy
						'@id': id('MerchantReturnPolicy', room.name + '_returnPolicy'),
						'url': room.url || hotel.url,
						'name': hotel.name + ' ' + room.name + ' return policy',
						'applicableCountry': hotel.location.country || 'USA',
						'returnPolicyCountry': hotel.location.country || 'USA',
						'returnPolicyCategory': 'MerchantReturnFiniteReturnWindow', // https://schema.org/MerchantReturnEnumeration
					},
					'priceSpecification': {
						'@type': 'UnitPriceSpecification', // https://schema.org/UnitPriceSpecification
						'@id': id('UnitPriceSpecification', room.name),
						'url': room.url,
						'name': room.name + ' pricing',
						// 'minPrice': room.minPrice,
						'price': room.minPrice || room.defaultPrice || room.maxPrice,  // auditable
						// 'maxPrice': room.maxPrice,
						'priceCurrency': 'USD',
						'unitCode': 'DAY',
					}
				},
				'bed': {
					'@type': 'BedDetails', // https://schema.org/BedDetails
					'@id': id('BedDetails', name + '_bed'),
					'numberOfBeds': room.bedCount,
					'typeOfBed': {
						'@type': 'BedType', // https://schema.org/BedType
						'@id': id('BedType', name + '_bedType-' + room.bedType),
						'name': room.bedType,
					},
				},
				'occupancy': {
					'@type': 'QuantitativeValue', // https://schema.org/QuantitativeValue
					'@id': id('QuantitativeValue', name + '_occupancy'),
					'name': 'Number of occupants',
					'minValue': 1,
					'maxValue': room.maxOccupancy,
				},
				'petsAllowed': petsBoolean,
				'photo': roomImages[0],
				'image': roomImages,
				'smokingAllowed': room.smokingBoolean || false,
				'tourBookingPage': room.tourUrl,
				'description': room.description,
				'potentialAction': {
					'@type': 'ReserveAction', // https://schema.org/ReserveAction
					'@id': id('ReserveAction', room.name),
					'name': 'Reserve',
					'scheduledTime': room.checkInTime || hotel.checkInTime,
					'startTime': room.checkInTime || hotel.checkInTime,
					"object": {
						'@type': 'LodgingReservation', // https://schema.org/LodgingReservation
						'@id': id('LodgingReservation', room.name),
						'url': room.bookUrl,
						'mainEntityOfPage': room.url,
						'checkinTime': room.checkInTime || hotel.checkInTime,
						'checkoutTime': room.checkOutTime || hotel.checkOutTime,
						'lodgingUnitDescription': room.description,
						'lodgingUnitType': room.bedCount + ' total beds',
						'provider': {"@id": hotelId},
						'reservationFor': {"@id": roomId},
						// 'totalPrice': '',
						'potentialAction': {
							'@type': 'ReserveAction', // https://schema.org/ReserveAction
							'@id': id('ReserveAction', room.name),
							'url': room.bookUrl,
							'name': 'Reserve',
						},
						'subjectOf': room.bookUrl,
					},
					'provider': {"@id": hotelId},
					"target": room.bookUrl
				}
			})

		});
	}

	// page template
	const schema = {
		'@context': 'https://schema.org',
		'@graph': [
			// WebSite
			{
				"@type": "WebSite", // https://schema.org/WebSite
				"@id": id('WebSite', hotel.name),
				"url": hotel.homepage,
				"name": hotel.name,
			},
			// WebPage
			{
				"@type": "WebPage", // https://schema.org/WebPage
				"@id": id('WebPage', hotel.name),
				"url": hotel.page.url,
				"name": hotel.page.name,
				"speakable": {
					"@type": "SpeakableSpecification", // https://schema.org/SpeakableSpecification
					"@id": id('SpeakableSpecification', hotel.name),
					"url": hotel.page.url,
					"xPath": [
						"/html/head/title",
						"/html/head/meta[@name='description']/@content"
					]
				},
				"isPartOf": {"@id": id('WebSite', hotel.name)},
				"about": {"@id": hotelId},
				"breadcrumb": {"@id": id('BreadcrumbList', hotel.name)},
			},
			// BreadcrumbList
			{
				"@type": "BreadcrumbList", // https://schema.org/BreadcrumbList
				"@id": id('BreadcrumbList', hotel.name),
				"url": hotel.page.url,
				"name": hotel.page.name,
				"itemListElement": [{
					"@type": "ListItem", // https://schema.org/ListItem
					"@id": id('ListItem', hotel.name + '#breadcrumbListItem'),
					"url": hotel.page.url,
					"name": hotel.page.name,
					"position": 1,
					"item": hotel.page.url,
				}]
			},
			// LodgingBusiness
			{
				'@type': hotelType || 'Hotel', // https://schema.org/LodgingBusiness or a subtype
				'@id': hotelId,
				'url': hotel.homepage,
				'name': hotel.name,
				'description': hotel.description,
				'checkinTime': hotel.checkInTime,
				'checkoutTime': hotel.checkOutTime,
				'petsAllowed': hotel.petsAllowedTrueFalse,
				'amenityFeature': amenities,
				'numberOfRooms': roomGroups || hotel.totalRoomCount,
				'starRating': {
					'@type': 'Rating', // https://schema.org/Rating
					'@id': id('Rating', hotel.name),
					'url': hotel.homepage,
					'name': hotel.name + ' Star Rating',
					'ratingValue': hotel.rating.value,
				},
				'address': {
					'@type': 'PostalAddress', // https://schema.org/PostalAddress
					'@id': id('PostalAddress', hotel.name + hotel.location.street),
					'name': hotel.name,
					'streetAddress': hotel.location.street,
					'addressLocality': hotel.location.city,
					'addressRegion': hotel.location.state,
					'postalCode': hotel.location.state,
					'addressCountry': hotel.location.country,
					'telephone': hotel.contact.phone,
					'email': hotel.contact.email,
				},
				"brand": {
					"@type": "Brand", // https://schema.org/Brand
					"@id": id('Brand', hotel.name),
					"url": hotel.homepage,
					"name": hotel.name,
					"slogan": hotel.slogan,
				},
				"sameAs": [hotel.facebookUrl, hotel.instagramUrl, hotel.twitterUrl, hotel.linkedinUrl],
				'currenciesAccepted': hotel.currenciesAccepted,
				'openingHours': hotel.openingHours,
				'paymentAccepted': hotel.paymentAccepted,
				'availableLanguage': hotel.availableLanguage,
				'priceRange': hotel.priceRange,
				'logo': {"@id": id('ImageObject', hotel.name + '#logo')},
				'image': [{ "@id": id('ImageObject', hotel.name + '#logo')}, images],
				'containsPlace': rooms,
			},
			// ImageObject (logo)
			{
				"@type": "ImageObject", // https://schema.org/ImageObject
				"@id": id('ImageObject', hotel.name + '#logo'),
				"url": hotel.logoUrl,
				"name": hotel.name + " logo",
				"contentUrl": hotel.logoUrl,
				"caption": hotel.name + " logo",
				"copyrightNotice": "All rights reserved | " + hotel.name,
				"creditText": hotel.name,
				'license': hotel.copyrightUrl || hotel.url,
				'acquireLicensePage': hotel.copyrightUrl || hotel.url,
				"creator": {
					'@type': 'Organization', // https://schema.org/Organization
					'@id': hotelId,
				},
			},
			// AggregateRating (Hotel)
			{
				"@type": "AggregateRating", // https://schema.org/AggregateRating
				"@id": id('AggregateRating', hotel.name),
				"url": hotel.page.url,
				"name": hotel.name + " Aggregate Rating",
				"ratingCount": hotel.rating.count,
				"ratingValue": hotel.rating.value,
				"bestRating": 5, // seems safe enough to use static value of 5
				"itemReviewed": {
					"@type": "Product", // https://schema.org/Product
					"@id": id('Product', hotel.name + '-' + hotel.page.url),
					"url": hotel.page.url,
					"name": hotel.name,
					"aggregateRating": {
						"@type": "AggregateRating", // https://schema.org/AggregateRating
						"@id": id('AggregateRating', hotel.name + '-' + hotel.page.inquireableItem),
						"url": hotel.page.url,
						"name": hotel.name + " Aggregate Rating",
						"ratingCount": hotel.rating.count,
						"ratingValue": hotel.rating.value,
						"bestRating": 5 // seems safe enough to use static value of 5
					},
					"offers": {
						"@type": "AggregateOffer", // https://schema.org/AggregateOffer
						"@id": id('AggregateOffer', hotel.name + '-' + hotel.page.inquireableItem),
						"url": hotel.page.url,
						"lowPrice": hotel.lowestPrice,
						"highPrice": hotel.highestPrice,
						"priceCurrency": "USD"
					}
				}
			},
		],
	}

	// if required video fields met, push video object to schema
	if (hotel.page.video.thumbnailUrl && hotel.page.video.uploadDateISO && (hotel.page.video.contentUrl || hotel.page.video.embedUrl)) {
		schema['@graph'].push({
			"@type": "VideoObject", // https://schema.org/VideoObject
			"@id": id('VideoObject', hotel.name),
			"url": hotel.page.url,
			"name": hotel.page.video.name,
			"description": hotel.page.video.description,
			"thumbnailUrl": hotel.page.video.thumbnailUrl,
			"uploadDate": hotel.page.video.uploadDateISO,
			"duration": "PT" + hotel.page.video.duration.min + "M" + hotel.page.video.duration.sec + "S",
			"contentUrl": hotel.page.video.contentUrl,
			"embedUrl": hotel.page.video.embedUrl,
			"regionsAllowed": "US,NL"
		})
	}
	
	// add the JSON to a 'script' tag and add it to the <head> of the page
	const script = document.createElement('script');
	script.type = 'application/ld+json';
	script.text = JSON.stringify(schema);
	document.querySelector('head').appendChild(script);

}
