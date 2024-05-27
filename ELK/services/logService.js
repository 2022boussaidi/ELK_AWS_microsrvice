const kibanaService = require('./kibanaService');

const formatDate = (date) => {
  return date.toISOString(); // Converts date to the format 'YYYY-MM-DDTHH:mm:ss.sssZ'
};

const getNowAndFifteenMinutesAgo = () => {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
  return { now, fifteenMinutesAgo };
};

const fetchErrorMetrics = async () => {
  const { now, fifteenMinutesAgo } = getNowAndFifteenMinutesAgo();
  const body = {
    aggs: {
      2: {
        significant_terms: {
          field: 'fields.site.keyword',
          size: 100,
        },
        aggs: {
          3: {
            significant_terms: {
              field: 'host.hostname.keyword',
              size: 500,
            },
            aggs: {
              4: {
                significant_terms: {
                  field: 'loglevel.keyword',
                  size: 8,
                },
              },
            },
          },
        },
      },
    },
    size: 0,
    fields: [
      {
        field: '@timestamp',
        format: 'date_time',
      },
    ],
    query: {
      bool: {
        filter: [
          {
            range: {
              '@timestamp': {
                format: 'strict_date_optional_time',
                gte: formatDate(fifteenMinutesAgo),
                lte: formatDate(now),
              },
            },
          },
        ],
        must_not: [
          { match_phrase: { 'loglevel.keyword': 'INFO' } },
          { match_phrase: { 'loglevel.keyword': 'DEBUG' } },
        ],
      },
    },
  };

  return await kibanaService.postToKibana('ekarasa*/_search', body);
};

const fetchCountLogs = async () => {
  const { now, fifteenMinutesAgo } = getNowAndFifteenMinutesAgo();
  const body = {
    aggs: {
      2: {
        terms: {
          field: 'loglevel.keyword',
          order: { _count: 'desc' },
          size: 5,
        },
      },
    },
    size: 0,
    fields: [
      {
        field: '@timestamp',
        format: 'date_time',
      },
    ],
    query: {
      bool: {
        filter: [
          {
            range: {
              '@timestamp': {
                format: 'strict_date_optional_time',
                gte: formatDate(fifteenMinutesAgo),
                lte: formatDate(now),
              },
            },
          },
        ],
      },
    },
  };

  return await kibanaService.postToKibana('ekarasa*/_search', body);
};

const fetchLogs = async () => {
  const { now, fifteenMinutesAgo } = getNowAndFifteenMinutesAgo();
  const body = {
    track_total_hits: false,
    sort: [
      {
        '@timestamp': {
          order: 'desc',
        },
      },
    ],
    fields: [
      { field: '*', include_unmapped: 'true' },
      { field: '@timestamp', format: 'strict_date_optional_time' },
    ],
    size: 500,
    query: {
      bool: {
        filter: [
          {
            range: {
              '@timestamp': {
                
                  "format": "strict_date_optional_time",
                  "gte": "2024-05-26T23:00:00.000Z",
                  "lte": "2024-05-27T22:59:59.999Z"
              },
            },
          },
        ],
      },
    },
    highlight: {
      pre_tags: ['@kibana-highlighted-field@'],
      post_tags: ['@/kibana-highlighted-field@'],
      fields: {
        '*': {},
      },
      fragment_size: 2147483647,
    },
  };

  return await kibanaService.postToKibana('ekarasa*/_search', body);
};

const fetchErrorByTime = async () => {
  const { now, fifteenMinutesAgo } = getNowAndFifteenMinutesAgo();
  const body = {
    aggs: {
      2: {
        date_histogram: {
          field: '@timestamp',
          fixed_interval: '30s',
          time_zone: 'Africa/Tunis',
          min_doc_count: 1,
        },
        aggs: {
          3: {
            significant_terms: {
              field: 'loglevel.keyword',
              size: 8,
            },
          },
        },
      },
    },
    size: 0,
    fields: [
      {
        field: '@timestamp',
        format: 'date_time',
      },
    ],
    query: {
      bool: {
        filter: [
          {
            range: {
              '@timestamp': {
                format: 'strict_date_optional_time',
                gte: formatDate(fifteenMinutesAgo),
                lte: formatDate(now),
              },
            },
          },
        ],
        must_not: [
          { match_phrase: { 'loglevel.keyword': 'DEBUG' } },
          { match_phrase: { 'loglevel.keyword': 'INFO' } },
        ],
      },
    },
  };

  return await kibanaService.postToKibana('ekarasa*/_search', body);
};

const fetchTotalLogs = async () => {
  const { now, fifteenMinutesAgo } = getNowAndFifteenMinutesAgo();
  const body = {
    size: 0,
    fields: [
      {
        field: '@timestamp',
        format: 'date_time',
      },
    ],
    query: {
      bool: {
        filter: [
          {
            range: {
              '@timestamp': {
                format: 'strict_date_optional_time',
                gte: formatDate(fifteenMinutesAgo),
                lte: formatDate(now),
              },
            },
          },
        ],
      },
    },
  };

  return await kibanaService.postToKibana('rsylog-*/_search', body);
};

const fetchLastMeasures = async () => {
  const { now, fifteenMinutesAgo } = getNowAndFifteenMinutesAgo();
  const body = {
    "aggs": {
      "4": {
        "filters": {
          "filters": {
            "\"Sending results\"": {
              "bool": {
                "must": [],
                "filter": [
                  {
                    "multi_match": {
                      "type": "phrase",
                      "query": "Sending results",
                      "lenient": true
                    }
                  }
                ],
                "should": [],
                "must_not": []
              }
            }
          }
        },
        "aggs": {
          "3": {
            "terms": {
              "field": "host.name.keyword",
              "order": {
                "_key": "desc"
              },
              "size": 600
            }
          }
        }
      }
    },
    "size": 0,
    "fields": [
      {
        "field": "@timestamp",
        "format": "date_time"
      }
    ],
    "script_fields": {},
    "stored_fields": [
      "*"
    ],
    "runtime_mappings": {},
    "_source": {
      "excludes": []
    },
    "query": {
      "bool": {
        "must": [],
        "filter": [
          {
            "range": {
              "@timestamp": {
                "format": 'strict_date_optional_time',
                "gte": formatDate(fifteenMinutesAgo),
                "lte": formatDate(now),
              }
            }
          }
        ],
        "should": [],
        "must_not": []
      }
    }
  };

  return await kibanaService.postToKibana('ekarasa*/_search', body);
};

const fetchLastMeasuresByTime = async () => {
  const { now, fifteenMinutesAgo } = getNowAndFifteenMinutesAgo();
  const body = {
    "aggs": {
      "2": {
        "date_histogram": {
          "field": "@timestamp",
          "fixed_interval": "30m",
          "time_zone": "Africa/Tunis",
          "min_doc_count": 1
        },
        "aggs": {
          "3": {
            "terms": {
              "field": "host.hostname.keyword",
              "order": {
                "_count": "desc"
              },
              "size": 100
            },
            "aggs": {
              "4": {
                "filters": {
                  "filters": {
                    "\"Sending results\"": {
                      "bool": {
                        "must": [],
                        "filter": [
                          {
                            "multi_match": {
                              "type": "phrase",
                              "query": "Sending results",
                              "lenient": true
                            }
                          }
                        ],
                        "should": [],
                        "must_not": []
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "size": 0,
    "fields": [
      {
        "field": "@timestamp",
        "format": "date_time"
      }
    ],
    "script_fields": {},
    "stored_fields": [
      "*"
    ],
    "runtime_mappings": {},
    "_source": {
      "excludes": []
    },
    "query": {
      "bool": {
        "must": [],
        "filter": [
          {
            "range": {
              "@timestamp": {
                "format": 'strict_date_optional_time',
                "gte": formatDate(fifteenMinutesAgo),
                "lte": formatDate(now),
              }
            }
          }
        ],
        "should": [],
        "must_not": []
      }
    }
  };

  return await kibanaService.postToKibana('ekarasa*/_search', body);
};

const fetchActionByRobot = async () => {
  const { now, fifteenMinutesAgo } = getNowAndFifteenMinutesAgo();
  const body = {
    "version": true,
    "size": 500,
    "sort": [
      {
        "@timestamp": {
          "order": "desc",
          "unmapped_type": "boolean"
        }
      }
    ],
    "fields": [
      {
        "field": "*",
        "include_unmapped": "true"
      },
      {
        "field": "@timestamp",
        "format": "strict_date_optional_time"
      }
    ],
    "script_fields": {},
    "stored_fields": [
      "*"
    ],
    "runtime_mappings": {},
    "_source": false,
    "query": {
      "bool": {
        "must": [],
        "filter": [
          {
            "bool": {
              "should": [
                {
                  "match_phrase": {
                    "DFY_Action": "START"
                  }
                },
                {
                  "match_phrase": {
                    "DFY_Action": "LOADED"
                  }
                }
              ],
              "minimum_should_match": 1
            }
          },
          {
            "range": {
              "@timestamp": {
                "format": 'strict_date_optional_time',
                "gte": formatDate(fifteenMinutesAgo),
                "lte": formatDate(now),
              }
            }
          }
        ],
        "should": [],
        "must_not": []
      }
    },
    "highlight": {
      "pre_tags": [
        "@kibana-highlighted-field@"
      ],
      "post_tags": [
        "@/kibana-highlighted-field@"
      ],
      "fields": {
        "*": {}
      },
      "fragment_size": 2147483647
    }
  };

  return await kibanaService.postToKibana('ekarasa*/_search', body);
};

module.exports = {
  fetchErrorMetrics,
  fetchCountLogs,
  fetchLogs,
  fetchErrorByTime,
  fetchTotalLogs,
  fetchLastMeasures,
  fetchLastMeasuresByTime,
  fetchActionByRobot,
};
